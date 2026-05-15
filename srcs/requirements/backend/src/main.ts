import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist : true}));
  app.use(helmet());
  app.use((_req: any, res: any, next: any) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  app.enableCors({
      origin: [`https://${process.env.DOMAIN}`, 'http://localhost:5173'],
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      allowedHeaders : ['Content-Type', 'Authorization'],
      credentials: true,
  });
  await app.listen(3000, '0.0.0.0')
}
bootstrap()
