import { Controller, Post, Get, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

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
import { LoginResponseDto, LogoutResponseDto } from '../common/dto/auth-response.dto';
import { UserProfileDto } from '../common/dto/users-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserProfileDto })
  @ApiResponse({ status: 409, description: 'USER_ALREADY_EXISTS' })
  @Throttle({ auth: THROTTLE_LIMIT_AUTH })
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.username, body.email, body.password);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'INVALID_CREDENTIALS' })
  @Throttle({ auth: THROTTLE_LIMIT_AUTH })
  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginDto) {
    return this.authService.login(body.identifier, body.password);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, type: UserProfileDto })
  @Throttle({ auth: THROTTLE_LIMIT_API })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: SafeUser) {
    return user;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, type: LogoutResponseDto })
  @Throttle({ auth: THROTTLE_LIMIT_AUTH })
  @Post('logout')
  @HttpCode(200)
  logout(){
    return { message: 'LOGOUT_SUCCESS' };
  }

}
