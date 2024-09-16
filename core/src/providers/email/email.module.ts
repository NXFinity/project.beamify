import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { Verification } from './templates/verification';
import { UsersModule } from '../../api/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [EmailController],
  providers: [EmailService, Verification],
  exports: [EmailService],
})
export class EmailModule {}
