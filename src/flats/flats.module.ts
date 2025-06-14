import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlatController } from './flats.controller';
import { FlatService } from './flats.service';
import { FlatModel, FlatSchema } from './schemas/flat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FlatModel.name, schema: FlatSchema }]),
  ],
  controllers: [FlatController],
  providers: [FlatService],
})
export class FlatModule {}
