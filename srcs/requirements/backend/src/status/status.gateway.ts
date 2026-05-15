import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserStatus } from '@prisma/client';

@WebSocketGateway({
    namespace: '/status',
    cors: { origin: [process.env.DOMAIN ? `https://${process.env.DOMAIN}` : '', 'http://localhost:5173'], credentials: true },
})
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private jwtService: JwtService,
        private authService: AuthService,
        private prisma: PrismaService,
    ) {}

    private async authenticate(client: Socket): Promise<number | null> {
        const token = client.handshake.auth?.token;
        if (!token)
          return null;
        try {
            const payload = this.jwtService.verify<{ sub: number }>(token);
            const user = await this.authService.validateUser(payload.sub);
            return user?.id ?? null;
        } catch {
            return null;
        }
    }

    async handleConnection(client: Socket) {
        const userId = await this.authenticate(client);
        if (!userId) {
          client.disconnect();
          return;
        }
        client.data.userId = userId;
        await this.prisma.user.update({
            where: { id: userId },
            data: { status: UserStatus.ONLINE },
        });
        client.emit('status', {status: 'ONLINE', userId});
    }

    async handleDisconnect(client: Socket) {
        const userId = client.data.userId;
        if (!userId)
          return;
        await this.prisma.user.update({
            where: { id: userId },
            data: { status: UserStatus.OFFLINE },
        });
        client.emit('status', {status: 'OFFLINE', userId});
    }
}
