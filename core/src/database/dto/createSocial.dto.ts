import { PartialType } from '@nestjs/swagger';

export class CreateSocialDto {
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  onlyFans: string;
  reddit: string;
  fansly: string;
  twitch: string;
  youtube: string;
  trovo: string;
  kick: string;
  discord: string;
  steam: string;
  epic: string;
  battleNet: string;
  psn: string;
  xbox: string;
  nintendo: string;
  origin: string;
  snapchat: string;
  tiktok: string;
  whatsapp: string;
}

export class UpdateSocialDto extends PartialType(CreateSocialDto) {}
