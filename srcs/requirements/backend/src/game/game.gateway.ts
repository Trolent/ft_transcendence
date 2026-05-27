import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets'
import { GameService, JoinInput } from './game.service'
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/ws-jwt.guard'
import { AuthService } from '../auth/auth.service'
import { Socket, Namespace } from 'socket.io';
import { MAX_WPM } from '../common/game.constant';
import { WS_CORS } from '../common/ws.config'

function sanitizeGuestName(raw: unknown): string {
	if (typeof raw !== 'string') return 'Guest';
	const name = raw.trim().replace(/\s+/g, ' ').slice(0, 20).trim();
	return name.length > 0 ? name : 'Guest';
}

@WebSocketGateway({ cors: WS_CORS, namespace: '/game' })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Namespace;

  constructor(
	  private gameService: GameService,
	  private authService: AuthService,
  ) {}

  afterInit() {
	this.gameService.setServer(this.server);
  }

  async handleConnection(client: Socket) {
    const auth = client.handshake.auth ?? {};
    // Logged-in players authenticate by JWT (sets client.data.user).
    if (auth.token) {
        const ok = await this.authService.validateWsClient(client);
        if (!ok)
            return client.disconnect();
        return;
    }
    // Guests opt in explicitly; they race + count toward placement but are
    // never persisted. Any other tokenless connection is rejected.
    if (auth.guest === true) {
        client.data.guest = { username: sanitizeGuestName(auth.nickname) };
        return;
    }
    return client.disconnect();
  }

  async handleDisconnect(client: Socket) {
	const left = await this.gameService.handleDisconnect(client.id);
	if (!left)
		return;
	for (const socketId of left.others)
		this.server.sockets.get(socketId)?.emit('participant_left', {
			pid: left.pid,
			username: left.username,
			cancelled: left.cancelled,
		});
  }

  // Identity comes from the JWT (client.data.user) or the guest handshake
  // (client.data.guest). Guests race and count toward placement but are never
  // persisted; the guest path is enabled in the ws guard.
  private resolveJoin(client: Socket): JoinInput | null {
	const user = client.data.user;
	if (user)
		return { socketId: client.id, kind: 'user', userId: user.id, username: user.username, avatarUrl: user.avatarUrl ?? null };
	const guest = client.data.guest;
	if (guest)
		return { socketId: client.id, kind: 'guest', userId: null, username: guest.username, avatarUrl: null };
	return null;
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_queue')
  handleJoinQueue(client: Socket) {
	const input = this.resolveJoin(client);
	if (!input)
		return;
	const room = this.gameService.assign(input);
	if (room)
		client.join(room.id);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave_queue')
  async handleLeaveQueue(client: Socket) {
	const left = await this.gameService.handleDisconnect(client.id);
	if (!left)
		return;
	client.leave(left.roomId);
	for (const socketId of left.others)
		this.server.sockets.get(socketId)?.emit('participant_left', {
			pid: left.pid,
			username: left.username,
			cancelled: left.cancelled,
		});
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('player_progress')
  async handleProgress(client: Socket, payload: { chars: number }) {
	if (typeof payload?.chars !== 'number')
		return;
	const delta = this.gameService.updateProgress(client.id, payload.chars);
	if (!delta)
		return;

	if (delta.wpm > MAX_WPM)
		console.warn(`[CHEAT?][${delta.roomId}] ${delta.username} wpm:${delta.wpm}`);

	this.server.to(delta.roomId).emit('race_update', {
		pid: delta.pid,
		username: delta.username,
		kind: delta.kind,
		progress: delta.progress,
		wpm: delta.wpm,
	});

	if (delta.progress >= 1) {
		const finish = this.gameService.handleFinish(client.id);
		if (finish) {
			client.emit('you_finished', { position: finish.position, playerCount: finish.playerCount });
			if (finish.allDone)
				await this.gameService.finalizeRace(finish.roomId);
		}
	}
  }
}
