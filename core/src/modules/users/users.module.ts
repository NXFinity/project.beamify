import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from '../../rest/users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../../database/entities/user/user.entity";
import {Profile} from "../../database/entities/user/profile.entity";
import {Social} from "../../database/entities/user/social.entity";
import {Billing} from "../../database/entities/billing/billing.entity";
import {Discord} from "../../security/entities/discord.entity";
import {StripeModule} from "../../providers/stripe/stripe.module";
import {PostsModule} from "../posts/posts.module";
import {StudioModule} from "../studio/studio.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Social, Billing, Discord]),
    StripeModule,
    PostsModule,
    StudioModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
