import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GrievanceCategoryService } from './grievanceCategory.service';
import { GrievanceCategoryDto } from './dto/grievanceCategory.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Grievance Categories')
@Controller('grievance-category')
export class GrievanceCategoryController {
  constructor(private readonly grievanceCategoryService: GrievanceCategoryService) { }

  @Post('create')
  create(@Body() data: GrievanceCategoryDto) {
    return this.grievanceCategoryService.createGrievanceCategory(data);
  }

  @Get()
  findAll() {
    return this.grievanceCategoryService.getAllGrievanceCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grievanceCategoryService.getGrievanceCategoryById(+id);
  }

  @Put('update/:id')
  @ApiBody({ type: GrievanceCategoryDto })
  update(@Param('id') id: string, @Body() data: Partial<GrievanceCategoryDto>) {
    return this.grievanceCategoryService.updateGrievanceCategory(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.grievanceCategoryService.deleteGrievanceCategory(+id);
  }

  @Delete('permanent/:id')
  permanentRemove(@Param('id') id: string) {
    return this.grievanceCategoryService.permanentDeleteGrievanceCategory(+id);
  }
}
