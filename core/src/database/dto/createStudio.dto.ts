import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateStudioDto {
  @ApiProperty()
  streamTitle: string;
  @ApiProperty()
  streamDescription: string;
}

export class UpdateStudioDto extends PartialType(CreateStudioDto) {}
