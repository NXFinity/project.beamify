import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { User } from '../user/user.entity';

@Entity('posts')
export class Posts extends BaseEntity {
  @Column()
  postContent: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn()
  user: User;
}
