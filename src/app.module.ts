import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { BookingModule } from './bookings/bookings.module';
import { FlatModule } from './flats/flats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') || 'mongodb://localhost:27017/aigerus',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    BookingModule,
    FlatModule,
  ],
  providers: [],
})
export class AppModule {}
