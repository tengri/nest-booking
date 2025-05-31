import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlatController } from './flat.controller';
import { FlatService } from './flat.service';
import { Flat, FlatSchema } from './schemas/flat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Flat.name, schema: FlatSchema }]),
  ],
  controllers: [FlatController],
  providers: [FlatService],
})
export class FlatModule {}
