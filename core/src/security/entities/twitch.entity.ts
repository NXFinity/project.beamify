import { Entity } from 'typeorm';
import { BaseEntity } from '../../database/base/base.entity';

@Entity('twitch')
export class Twitch extends BaseEntity {
  twitchId: string;
  username: string;
  displayName: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
}
