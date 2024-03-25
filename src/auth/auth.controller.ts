import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LoginRequest } from './dto/login-request.dto';
import { LoginResponse } from './dto/login-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
     constructor(private readonly authService: AuthService) {}

     @HttpCode(HttpStatus.OK)
     @UseGuards(LocalAuthGuard)
     @ApiOperation({ description: 'Login user' })
     @ApiOkResponse({
          description: 'The user logged in successfully.',
          type: LoginResponse,
     })
     @ApiBody({
          description: 'Credentials of user',
          type: LoginRequest,
     })
     @Post('login')
     async login(@Body() loginRequest: LoginRequest & User): Promise<LoginResponse> {
          return this.authService.login(loginRequest);
     }

     @HttpCode(HttpStatus.CREATED)
     @ApiOperation({ description: 'Register a new user' })
     @ApiCreatedResponse({
          description: 'The user has been successfully registered.',
          type: User,
     })
     @ApiBody({
          description: 'User data',
          type: CreateUserDto,
     })
     @Post('register')
     async register(@Body() createUserDto: CreateUserDto): Promise<User> {
          return this.authService.register(createUserDto);
     };
};