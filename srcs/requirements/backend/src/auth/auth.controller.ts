import { Controller, Post, Get, Body, UseGuards, HttpCode } from '@nestjs/common';

//API LIMIT
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_LIMIT_AUTH, THROTTLE_LIMIT_API } from '../common/throttle.constants';

//AUTH
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { SafeUser } from '../common/types';

//DTO STRICT
import { RegisterDto, LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ auth: THROTTLE_LIMIT_AUTH })
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.username, body.email, body.password);
  }

  @Throttle({ auth: THROTTLE_LIMIT_AUTH })
  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Throttle({ auth: THROTTLE_LIMIT_API })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: SafeUser) {
    return user;
  }

  // WARN Ajoutez la suppression du token dans le local storage coter front apres !!
  @Throttle({ auth: THROTTLE_LIMIT_AUTH })
  @Post('logout')
  @HttpCode(200)
  logout(){
    return { message: 'LOGOUT_SUCCESS' };
  }

}
