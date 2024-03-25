import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configs from 'src/config/index';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    load: configs,
    isGlobal: true,
  }), MongooseModule.forRootAsync({
    inject: [DatabaseService],
    imports: [DatabaseModule],
    useFactory: (databaseService: DatabaseService) => databaseService.createMongooseOptions(),
  }),

    UsersModule,
    AuthModule,

  ],
})

export class AppModule {}
