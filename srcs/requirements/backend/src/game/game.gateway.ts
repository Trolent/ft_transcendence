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
import { AuthService } from '../auth/auth.service'
import { Socket, Namespace } from 'socket.io';
import { MAX_PLAYERS, MAX_WPM } from '../common/game.constant';
import { WS_CORS } from '../common/ws.config'

@WebSocketGateway({ cors: WS_CORS, namespace: '/game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Namespace;

  constructor(
	  private gameService: GameService,
	  private authService: AuthService,
  ) {}

  private lobbyTimer: NodeJS.Timeout | null = null;
  private lobbyTimerEndsAt: number | null = null;
  private readonly LOBBY_MS = 15_000;

  async handleConnection(client: Socket) {
	await this.authService.validateWsClient(client);
  }

  async handleDisconnect(client: Socket) {
	if(this.gameService.isInQueue(client.id))
	{
		this.gameService.removeFromQueue(client.id);
		this.broadcastLobbyUpdate();
		if (this.gameService.getQueueSize() < 2)
			this.cancelLobbyTimer();
	}

	const gameData = await this.gameService.handlePlayerDisconnect(client.id);
	if(gameData)
	{
		for(const id of gameData.others) {
			this.server.sockets.get(id)?.emit('opponent_disconnected',
			{ username: gameData.username, cancelled: gameData.cancelled });
		}
	}
  }

  private broadcastLobbyUpdate(): void {
	const players = this.gameService.getAllQueued().map(p => ({
		userId: p.userId,
		username: p.username,
		avatarUrl: p.avatarUrl,
	}));
	for (const player of this.gameService.getAllQueued()) {
		this.server.sockets.get(player.socketId)?.emit('lobby_update', {
			players,
			timerEndsAt: this.lobbyTimerEndsAt,
		});
	}
  }

  private startLobbyTimer(): void {
	if (this.lobbyTimer)
		return;
	if (this.gameService.getQueueSize() < 2)
		return ;
	this.lobbyTimerEndsAt = Date.now() + this.LOBBY_MS;
	this.lobbyTimer = setTimeout(() => {
		this.lobbyTimer = null;
		this.lobbyTimerEndsAt = null;
		this.launchRace();
	}, this.LOBBY_MS);
  }

  private cancelLobbyTimer(): void {
	if (this.lobbyTimer) {
		clearTimeout(this.lobbyTimer);
		this.lobbyTimer = null;
	}
	this.lobbyTimerEndsAt = null;
  }

  private async launchRace(): Promise<void> {
	const players = this.gameService.dequeuAll();
	if (players.length < 2)
		return ;
	const room = await this.gameService.createRoom(players);
	
	for (const player of players)
		this.server.sockets.get(player.socketId)?.join(room.id);

	this.server.to(room.id).emit('match_found', {
		roomId:	room.id,
		text:	room.text,
		players:	[...room.players.values()].map(p => ({
			userId: p.userId,
			username: p.username,
			avatarUrl: p.avatarUrl,
		})),
	});

	this.gameService.startCountdown(room.id, (time) => {
		if (time == null)
			this.server.to(room.id).emit('race_start');
		else
			this.server.to(room.id).emit('countdown', { time });
	}, async (roomId) => {
		const results = await this.gameService.forceFinishRace(roomId);
		if (results)
			this.server.to(roomId).emit('race_finished', { results });
	});
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_queue')
  async handleJoinQueue(client: Socket) {
	const user = client.data.user;
	const added = this.gameService.addToQueue({
		socketId:   client.id,
		userId:     user.id,
		username:   user.username,
		avatarUrl:  user.avatarUrl,
	});
	if(!added)
		return ;

	const size = this.gameService.getQueueSize();

	if (size >= MAX_PLAYERS) 
	{
		this.cancelLobbyTimer();
		this.broadcastLobbyUpdate();
		await this.launchRace();
	}
	else
	{
		this.broadcastLobbyUpdate();
		if (size >= 2)
			this.startLobbyTimer();
	}
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave_queue')
  handleLeaveQueue(client: Socket) {
	this.gameService.removeFromQueue(client.id);
	this.broadcastLobbyUpdate();
	if (this.gameService.getQueueSize() < 2)
		this.cancelLobbyTimer();
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
