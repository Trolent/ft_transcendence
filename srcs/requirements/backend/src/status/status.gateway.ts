import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserStatus } from '@prisma/client';
import { WS_CORS } from '../common/ws.config'

@WebSocketGateway({ cors: WS_CORS, namespace: '/status' })
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private authService: AuthService,
        private prisma: PrismaService,
    ) {}

    async handleConnection(client: Socket) {
        const ok = await this.authService.validateWsClient(client);
        if (!ok) return;
        const userId = client.data.user.id;
        client.data.userId = userId;
        await this.prisma.user.update({
            where: { id: userId },
            data: { status: UserStatus.ONLINE },
        });
        client.emit('status', { status: 'ONLINE', userId });
    }

    async handleDisconnect(client: Socket) {
        const userId = client.data.userId;
        if (!userId) return;
        await this.prisma.user.update({
            where: { id: userId },
            data: { status: UserStatus.OFFLINE },
        });
    }
}
