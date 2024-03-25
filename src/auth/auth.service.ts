import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './dto/jwt-payload.dto';
import { LoginResponse } from './dto/login-response.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
     constructor(
          private readonly usersService: UsersService,
          private readonly jwtService: JwtService,
     ) {};

     async validateUser(email: string, pass: string): Promise<any> | null {
          const user = await this.usersService.findByEmail(email);
          if (!user) {
               return null;
          };

          const passwordIsValid = await bcrypt.compare(pass, user.password);

          if (passwordIsValid) {
               const { userId, email } = user;
               return { userId, email };
          };

          return null;
     };

     async verify(token: string): Promise<User> {
          const decoded: JwtPayload = this.jwtService.verify(token, {
               secret: process.env.JWT_SECRET_KEY,
          });

          const user = await this.usersService.findByEmail(decoded.email);
          return user;
     }

     async login(user: User): Promise<LoginResponse> {
          const payload: JwtPayload = {
               email: user.email,
               sub: user.userId,
          };

          return { accessToken: this.jwtService.sign(payload) };
     };

     async register(createUserDto: CreateUserDto): Promise<User> {
          return this.usersService.create(createUserDto);
     };
};