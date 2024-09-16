import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  bio: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  avatar: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  cover: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  location: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  website: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  dob: Date;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
