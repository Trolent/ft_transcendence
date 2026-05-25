import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserStatus } from '@prisma/client';
import { WS_CORS } from '../common/ws.config'

@WebSocketGateway({ cors: WS_CORS, namespace: '/status' })
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;

    constructor(
        private authService: AuthService,
        private prisma: PrismaService,
    ) {}

    private broadcastStatus(userId: number, status: UserStatus) {
        this.server.emit('status:update', { userId, status });
    }

    async handleConnection(client: Socket) {
        const ok = await this.authService.validateWsClient(client);
        if (!ok) return;
        const userId = client.data.user.id;
        client.data.userId = userId;
        await this.prisma.user.update({
            where: { id: userId },
            data: { status: UserStatus.ONLINE },
        });
        this.broadcastStatus(userId, UserStatus.ONLINE);
    }

    async handleDisconnect(client: Socket) {
        const userId = client.data.userId;
        if (!userId) return;
        await this.prisma.user.update({
            where: { id: userId },
            data: { status: UserStatus.OFFLINE },
        });
        this.broadcastStatus(userId, UserStatus.OFFLINE);
    }
}
