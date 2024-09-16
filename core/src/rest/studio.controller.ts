import { Controller, Get, Param } from '@nestjs/common';
import { StudioService } from '../modules/studio/studio.service';
import { Public } from 'src/decorators/public.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('studio')
export class StudioController {
  constructor(private readonly studiosService: StudioService) {}

  @Public()
  @Get()
  @ApiResponse({ status: 200, description: 'Get all streaming data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 503, description: 'Service Unavailable' })
  @ApiOperation({ summary: 'Get all streaming data | Public Accessible' })
  async findAll() {
    return await this.studiosService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.studiosService.findOne(id);
  }
}
