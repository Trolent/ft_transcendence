import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {

    constructor(
        private jwtService : JwtService,
        private authService : AuthService
    ) {}

    private disconnectClient(client:Socket) : boolean{
        client.disconnect();
        return false;
    }

    async canActivate(context: ExecutionContext): Promise<boolean>{

        const client: Socket = context.switchToWs().getClient();
        
        if(client.data.user)
            return true;

        const token = client.handshake.auth?.token;

        if(!token)
            return this.disconnectClient(client)

        try {
            const payload = this.jwtService.verify<{ sub:number}>(token);
            const user = await this.authService.validateUser(payload.sub);
            
            if(!user)
                return this.disconnectClient(client);

            client.data.user = user;
            return true;
        } catch {
            return this.disconnectClient(client);
        }
    }

}
