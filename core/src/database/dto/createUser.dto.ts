import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProfileDto } from './createProfile.dto';
import { CreateSocialDto } from './createSocial.dto';
import { Role } from '../../security/roles/roles.enum';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBillingDto } from './createBilling.dto';
import { CreateStudioDto } from './createStudio.dto';
import { Discord } from 'src/security/entities/discord.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username?: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email?: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password?: string;
  @IsString()
  @ApiProperty()
  roles?: Role[];
  @IsString()
  @ApiProperty()
  profile?: CreateProfileDto;
  @IsString()
  @ApiProperty()
  social?: CreateSocialDto;
  @ApiProperty()
  billing?: CreateBillingDto;
  @ApiProperty()
  studio?: CreateStudioDto;
  @ApiProperty()
  discord?: Discord;

  verifyToken?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
