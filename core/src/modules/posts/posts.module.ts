import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from '../../rest/posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '../../database/entities/post/posts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
