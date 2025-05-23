import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppartmentsModule } from './appartments/appartments.module';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from './schedule/schedule.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [AppartmentsModule, UsersModule, ScheduleModule, RoomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
