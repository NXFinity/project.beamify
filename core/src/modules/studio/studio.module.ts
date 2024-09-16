import { Module } from '@nestjs/common';
import { StudioService } from './studio.service';
import { StudioController } from '../../rest/studio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Studio} from "../../database/entities/studio/studio.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Studio])],
  controllers: [StudioController],
  providers: [StudioService],
  exports: [StudioService],
})
export class StudioModule {}
