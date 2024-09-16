import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Studio } from 'core/src/database/entities/studio/studio.entity';
import {User} from "../../database/entities/user/user.entity";

@Injectable()
export class StudioService {
  constructor(
    @InjectRepository(Studio) public studiosRepository: Repository<Studio>,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<Studio[]> {
    return this.studiosRepository
      .createQueryBuilder('studio')
      .leftJoinAndSelect('studio.user', 'user')
      .select([
        'studio.id',
        'studio.streamTitle',
        'studio.streamDescription',
        'studio.streamThumbnail',
        'studio.isLive',
        'studio.isFeatured',
        'studio.isPrivate',
        'studio.followers',
        'studio.subscribers',
        'studio.views',
      ])
      .getMany();
  }

  async findOne(id: string) {
    const studio = await this.studiosRepository.findOne({ where: { id } });
    if (!studio) {
      throw new NotFoundException(`Studio with id ${id} not found`);
    }
    return studio;
  }

  async create(user: User) {
    const newStream = new Studio();
    newStream.streamKey = this.generateStreamKey();

    // Generate a unique streamID from the streamKey
    newStream.streamID = crypto
      .createHash('sha256')
      .update(newStream.streamKey)
      .digest('hex');

    newStream.user = user;

    return await this.studiosRepository.save(newStream);
  }

  private generateStreamKey(): string {
    const timestamp = Date.now();
    const secret = this.configService.get('OME_SECRET');
    return crypto
      .createHmac('sha256', secret)
      .update(String(timestamp))
      .digest('hex');
  }

  async resetStreamKey(streamId: string, userId: string): Promise<Studio> {
    const stream = await this.studiosRepository.findOne({
      where: {
        id: streamId,
      },
      relations: ['user'],
    });

    if (!stream) {
      return null;
    }

    // Check if the stream belongs to the logged-in user
    if (stream.user.id !== userId) {
      throw new Error('You are not authorized to reset this stream key');
    }

    stream.streamKey = this.generateStreamKey();

    // Update the streamID as well
    stream.streamID = crypto
      .createHash('sha256')
      .update(stream.streamKey)
      .digest('hex');

    return await this.studiosRepository.save(stream);
  }
}
