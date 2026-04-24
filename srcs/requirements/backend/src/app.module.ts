import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'

@Module({
    controllers: [AppController],
    imports: [PrismaModule]
})
export class AppModule {}
