import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets'
import { GameService } from './game.service'
import { UseGuards, } from '@nestjs/common';
import { WsJwtGuard } from '../auth/ws-jwt.guard'
import { Socket, Namespace } from 'socket.io';

const MAX_WPM = 250;

@WebSocketGateway({ cors: { origin: [process.env.DOMAIN ? `https://${process.env.DOMAIN}` : '', 'http://localhost:5173'], credentials: true }, namespace: '/game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Namespace;

  constructor(private gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log('[WS] client connected:', client.id)
  }

  async handleDisconnect(client: Socket) {
    if(this.gameService.isInQueue(client.id))
        this.gameService.removeFromQueu(client.id);

    const gameData = await this.gameService.handlePlayerDisconnect(client.id);

    if(gameData){
        for(const id of gameData.others) {
            this.server.sockets.get(id)?.emit('opponent_disconnected',
            { username: gameData.username, cancelled: gameData.cancelled });
        }
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_queue')
  async handleJoinQueue(client: Socket) {
    const user = client.data.user;
    const matched = this.gameService.addToQueue({
        socketId:   client.id,
        userId:     user.id,
        username:   user.username,
        avatarUrl:  user.avatarUrl,
    });
    if(!matched)
        return ;

    const room = await this.gameService.createRoom(matched);

    for (const player of matched)
        this.server.sockets.get(player.socketId)?.join(room.id);

    this.server.to(room.id).emit('match_found', {
        roomId:     room.id,
        text:       room.text,
        players:    [...room.players.values()].map(p => ({
            userId:     p.userId,
            username:   p.username,
            avatarUrl:  p.avatarUrl,
        })),
    });

    // console.log(`[Game][${room.id}]CountDown start`);
    this.gameService.startCountdown(room.id, (time) => {
        if(time === null){
            console.log(`[Game][${room.id}]Race start`);
            this.server.to(room.id).emit('race_start');
        } else {
            this.server.to(room.id).emit('countdown', { time });
        }
            
    }, async (roomId) => {
        const results = await this.gameService.forceFinishRace(roomId);
        if(results)
            this.server.to(roomId).emit('race_finished', { results });
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave_queue')
  handleLeaveQueue(client: Socket) {
    this.gameService.removeFromQueu(client.id);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('player_progress')
  async handleProgress(client: Socket, payload: { chars: number}){
    if (typeof payload?.chars !== 'number')
        return;
    const delta = this.gameService.updateProgress(client.id, payload.chars);

    if(!delta)
        return ;

    if (delta.wpm > MAX_WPM)
        console.warn(`[CHEAT?][${delta.roomId}] ${delta.username} wpm:${delta.wpm} progress:${Math.round(delta.progress * 100)}%`)

    if (delta.progress >= 1){
        const finish = this.gameService.handlePlayerFinish(client.id);
        if (finish?.allDone) {
            const results = await this.gameService.finalizeRace(finish.roomId);
            this.server.to(finish.roomId).emit('race_finished', { results });
        }
        return;
    }

    // console.log(`[Game][${delta.roomId}]Game progression for ${delta.username.slice(0, 6)} ${Math.round(delta.progress * 100)}%`)
    this.server.to(delta.roomId).emit('race_update', {
        userId:     delta.userId,
        username:   delta.username,
        progress:   delta.progress,
        wpm:        delta.wpm,
    });
  }
}
