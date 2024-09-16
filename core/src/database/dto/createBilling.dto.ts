import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateBillingDto {
  @ApiProperty()
  accountName: string;
  @ApiProperty()
  accountNumber: string;
  @ApiProperty()
  accountSortCode: string;
  @ApiProperty()
  accountBankName: string;
}

export class UpdateBillingDto extends PartialType(CreateBillingDto) {}
