import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { BookingModule } from './bookings/bookings.module';
import { FlatModule } from './flats/flats.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { path } from 'app-root-path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path + '/uploads',
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI')!,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    BookingModule,
    FlatModule,
    FilesModule,
    AuthModule,
  ],
})
export class AppModule {}
