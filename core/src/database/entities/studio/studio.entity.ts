import { BaseEntity } from '../../base/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('studio')
export class Studio extends BaseEntity {
  @Column('varchar', {
    name: 'streamTitle',
    length: 255,
    default: 'This is a dummy title',
  })
  streamTitle: string;
  @Column('varchar', {
    name: 'streamDescription',
    length: 255,
    default: 'This is a dummy description',
  })
  streamDescription: string;
  @Column('varchar', {
    name: 'thumbnail',
    length: 255,
    default: 'https://i.postimg.cc/D08fC2VJ/av-logo.png',
  })
  streamThumbnail: string;

  @Column({ default: 0 })
  followers: number;
  @Column({ default: 0 })
  followings: number;
  @Column({ default: 0 })
  subscribers: number;
  @Column({ default: 0 })
  views: number;

  @Column('varchar', { name: 'streamKey', length: 512, default: 'stream-key' })
  streamKey: string;

  @Column({ default: false })
  isLive: boolean;

  @Column('varchar', { name: 'streamID', length: 512, default: 'stream-id' })
  streamID: string;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  isPrivate: boolean;

  @OneToOne(() => User, (user) => user.studio)
  @JoinColumn()
  user: User;
}
