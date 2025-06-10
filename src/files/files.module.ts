import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FlatModel, FlatSchema } from '../flats/schemas/flat.schema';
import { FlatService } from '../flats/flats.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [FilesService, FlatService],
  controllers: [FilesController],
  imports: [
    MongooseModule.forFeature([{ name: FlatModel.name, schema: FlatSchema }]),
  ],
})
export class FilesModule {}
