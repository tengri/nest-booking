import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BookingModule } from './booking/booking.module';
import { FlatModule } from './flat/flat.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/aigerus'),
    UsersModule,
    BookingModule,
    FlatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
