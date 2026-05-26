import { Injectable } from '@nestjs/common';
import { RoomState, RoomPlayer } from './game.types';
import { PrismaService } from '../prisma/prisma.service';
import { MatchStatus, UserStatus } from '@prisma/client';
import { MAX_WPM, QUOTES, MIN_RACE_SECONDS, MIN_CHARS_PER_SEC } from '../common/game.constant';
import { AchievementService } from '../achievement/achievement.service';

type QueueEntry = {
    socketId:   string;
    userId:     number;
    username:   string;
    avatarUrl:  string | null;
}

// utils

function generateRoomID(): string {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

function pickQuote() : string {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

@Injectable()
export class GameService{

    constructor(
        private prisma: PrismaService,
        private achievementService: AchievementService,
    ) {}

    private queue        = new Map<string, QueueEntry>();
    private rooms        = new Map<string, RoomState>();
    private socketToRoom = new Map<string, string>();

    //QUEUE

    private dequeuTwo(): QueueEntry[] {
        const iter      = this.queue.entries();
        const first     = iter.next().value!;
        const second    = iter.next().value!;

        this.queue.delete(first[0]);
        this.queue.delete(second[0]);

        return [first[1], second[1]];
    }

    addToQueue(entry : QueueEntry): QueueEntry[] | null {

        if (this.isInQueue(entry.socketId) || this.isInRoom(entry.socketId))
            return null;

        this.queue.set(entry.socketId, entry);
        console.log(`[Queue] ${entry.username} rej file ${this.queue.size} en attente`);
        
        if(this.queue.size >= 2)
            return this.dequeuTwo();

        return null;
    }

    removeFromQueu(socketId : string) : void {
        const entry = this.queue.get(socketId);
        if(entry){
            this.queue.delete(socketId);
            console.log(`[Queue] ${entry.username} a quitter la file`);
            return ;
        }
    }

    isInQueue(socketId: string) : boolean{
        return this.queue.has(socketId);
    }

    //ROOM

    async createRoom(players: QueueEntry[]): Promise<RoomState>{
        const id = generateRoomID();
        const text = pickQuote();

        const roomPlayers = new Map<string, RoomPlayer>();
        for(const data of players){
            roomPlayers.set(data.socketId, {
                socketId:   data.socketId,
                userId:     data.userId,
                username:   data.username,
                avatarUrl:  data.avatarUrl,
                chars:      0,
                progress:   0,
                wpm:        0,
                finished:   false,
                finishedAt: null
            });
            this.socketToRoom.set(data.socketId, id);
        }

        const room: RoomState = {
            id,
            matchId:        0,
            phase:          'waiting',
            text,
            players:        roomPlayers,
            maxPlayers:     2,
            startedAt:      null,
            countdown:      null,
            raceTimeout:    null,
        }
        const match = await this.prisma.match.create({
            data: {
                textSnippet:    text,
                startedAt:      new Date(),
                status:         MatchStatus.IN_PROGRESS,
            }
        });
        room.matchId = match.id;

        await this.prisma.user.updateMany({
            where: { id: { in: players.map(p => p.userId)}},
            data: {status: UserStatus.IN_GAME}
        })

        this.rooms.set(id, room);
        console.log(`[Room] ${id} creer / joueurs ${players.map(p => p.username).join(', ')}`);
        return room;
    }

    getRoom(roomId: string): RoomState | undefined {
        return this.rooms.get(roomId);
    }

    getRoomBySocketId(socketId: string): RoomState | undefined {
        const roomId = this.socketToRoom.get(socketId);

        if(roomId)
            return this.rooms.get(roomId);

        return undefined;
    }

    isInRoom(socketId: string): boolean {
        return this.socketToRoom.has(socketId);
    }

    cleanRoom(roomId: string): void {
        const room = this.rooms.get(roomId);

        if(!room)
            return;

        if (room.raceTimeout)
            clearTimeout(room.raceTimeout);

        if(room.countdown)
            clearTimeout(room.countdown);

        room.players.forEach(
            (_, socketId) => this.socketToRoom.delete(socketId)
        );
        this.rooms.delete(roomId);
        console.log(`[Room][${roomId}] deleted`);
    }

    private calcWpm(chars:number, startedAt: number) : number {
        const minutes = (Date.now() - startedAt) / 60000;
        
        if(minutes > 0)
            return Math.round((chars / 5) / minutes);

        return 0;
    }

    //GAME
    updateProgress(socketId: string, chars: number):
    {
        roomId:     string;
        userId:     number;
        username:   string;
        progress:   number;
        wpm:        number } | null {
        
        const room = this.getRoomBySocketId(socketId);
        if(!room || room.phase !== 'racing' || !room.startedAt)
            return null;
        
        const player = room.players.get(socketId);
        if(!player || player.finished)
            return null;
        
        const safeChars = Math.min(chars, room.text.length);
        player.chars    = safeChars;
        player.progress = safeChars / room.text.length;
        player.wpm      = this.calcWpm(safeChars, room.startedAt);

        return { roomId: room.id, userId: player.userId, username: player.username, progress: player.progress, wpm: player.wpm };
    }

    startCountdown(roomId: string, emit:(time:number | null) => void, onTimeout: (roomId: string) => void): void{

        const room = this.getRoom(roomId);

        if(!room)
            return ;

        room.phase = 'countdown';
        let time = 3;

        const tick = () => {
            if(time === 0){
                const maxMs = Math.max(MIN_RACE_SECONDS, Math.ceil(room.text.length / MIN_CHARS_PER_SEC)) * 1000;
                room.phase          = 'racing';
                room.startedAt      = Date.now();
                room.raceTimeout = setTimeout(() => onTimeout(room.id), maxMs);
                emit(null);
                return ;
            }
            emit(time);
            console.log(`[Game][${room.id}]CountDown ${time}`)
            time--;
            room.countdown = setTimeout(tick, 1000);
        };

        room.countdown = setTimeout(tick, 1000);

    }

    async finalizeRace(roomId: string): Promise<{ userId: number; username: string; wpm: number; position: number }[]>{
        const room = this.getRoom(roomId);
        if(!room || room.phase !== 'finished') return [];

        await this.prisma.match.update({
            where: { id: room.matchId },
            data:  { endedAt: new Date(), status: MatchStatus.FINISHED },
        });

        // tri
        const sorted = [...room.players.values()]
            .sort((a, b) => (a.finishedAt ?? Infinity) - (b.finishedAt ?? Infinity));

        await this.prisma.matchResult.createMany({
            data: sorted.map((p, i) => ({
                matchId:    room.matchId,
                userId:     p.userId,
                wpm:        p.wpm > MAX_WPM ? 0 : p.wpm,
                position:   i + 1,
                finishedAt: p.finishedAt ? new Date(p.finishedAt) : null,
            })),
        });

        await this.prisma.user.updateMany({
            where: { id: { in: sorted.map(p => p.userId) } },
            data:  { status: UserStatus.ONLINE },
        });

        const savedResults = await this.prisma.matchResult.findMany({
            where: { matchId: room.matchId },
        });
        for (const result of savedResults) {
            await this.achievementService.checkAndUnlockAchievements(result.userId, result);
        }

        this.cleanRoom(roomId);

        return sorted.map((p, i) => ({
            userId:   p.userId,
            username: p.username,
            wpm:      p.wpm > MAX_WPM ? 0 : p.wpm,
            position: i + 1,
        }));
    }

    async forceFinishRace(roomId : string) : Promise<{ userId: number; username: string; wpm: number; position: number }[]> {
        const room = this.getRoom(roomId);
        if(!room || room.phase === 'finished')
            return [];

        for(const player of room.players.values()){
            if(!player.finished){
                player.finished     = true;
                player.finishedAt   = Date.now();
            }
        }
        room.phase = 'finished';
        return this.finalizeRace(roomId);
    }

    //Player
    handlePlayerFinish(socketId : string): { roomId: string; allDone: boolean} | null {

        const room = this.getRoomBySocketId(socketId);

        if(!room || room.phase !== 'racing')
            return null;

        const player = room.players.get(socketId);

        if(!player || player.finished)
            return null;

        player.finished = true;
        player.finishedAt = Date.now();
        console.log(`[Game][${room.id}]Game finished for ${player.username.slice(0, 6)} 100%!`);

        const allDone = [...room.players.values()].every(ply => ply.finished);

        if(allDone)
            room.phase = 'finished';

        return {roomId: room.id, allDone};
    }

    async handlePlayerDisconnect(socketId: string): Promise<{
        roomId:     string;
        cancelled:  boolean;
        others:     string[];
        username:   string;
    } | null > {

        const room = this.getRoomBySocketId(socketId);

        if(!room)
            return null;

        const player = room.players.get(socketId);
        if(!player)
            return null;

        const others = [...room.players.keys()].filter(id => id !== socketId);
        const active = [...room.players.values()]
            .filter(p => p.socketId !== socketId && !p.finished).length;
        
        room.players.delete(socketId);
        this.socketToRoom.delete(socketId);

        const cancelled = room.phase !== 'finished' && active < 2;

        if(cancelled){
            //update match status
            await this.prisma.match.update({
                where:  { id: room.matchId },
                data:   { status: MatchStatus.CANCELLED},
            });

            //update user status
            await this.prisma.user.updateMany({
                where:  { id: { in: [...room.players.values()]
                    .map(p => p.userId).concat(player.userId)}},
                data:   { status: UserStatus.ONLINE},
            });

            this.cleanRoom(room.id);
        }else {
            await this.prisma.user.update({
                where:  { id: player.userId },
                data:   { status: UserStatus.ONLINE},
            });
        }

        return { roomId: room.id, cancelled, others, username: player.username };
    }
}