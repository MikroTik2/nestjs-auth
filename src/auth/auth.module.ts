import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthConfig } from 'src/config/auth.config';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
     imports: [
          UsersModule,
          PassportModule.register({ defaultStrategy: 'jwt' }),
          JwtModule.registerAsync({
               imports: [ConfigModule],
               inject: [ConfigService],

               useFactory: (configService: ConfigService) => ({
                    secret: configService.get<string>('auth.jwt.secretKey'),
                    signOptions: {
                         expiresIn: configService.get<number>('auth.jwt.expirationTime'),
                    },
               }),
          }),
     ],
     
     providers: [AuthService, JwtStrategy, LocalStrategy],
     controllers: [AuthController],
})

export class AuthModule {}