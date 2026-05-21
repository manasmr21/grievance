import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GrievanceSubCategoryService } from './grievanceSubCategory.service';
import { GrievanceSubCategoryDto } from './dto/grievanceSubCategory.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Grievance Sub-Categories')
@Controller('grievance-sub-category')
export class GrievanceSubCategoryController {
  constructor(private readonly grievanceSubCategoryService: GrievanceSubCategoryService) { }

  @Post('create')
  create(@Body() data: GrievanceSubCategoryDto) {
    return this.grievanceSubCategoryService.createGrievanceSubCategory(data);
  }

  @Get()
  findAll() {
    return this.grievanceSubCategoryService.getAllGrievanceSubCategories();
  }

  @Get('category/:category_id')
  getSubCategoriesByCategory(@Param('category_id') category_id: string) {
    return this.grievanceSubCategoryService.getGrievanceSubCategoriesByCategoryId(+category_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grievanceSubCategoryService.getGrievanceSubCategoryById(+id);
  }

  @Put('update/:id')
  @ApiBody({ type: GrievanceSubCategoryDto })
  update(@Param('id') id: string, @Body() data: Partial<GrievanceSubCategoryDto>) {
    return this.grievanceSubCategoryService.updateGrievanceSubCategory(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.grievanceSubCategoryService.deleteGrievanceSubCategory(+id);
  }

  @Delete('permanent/:id')
  permanentRemove(@Param('id') id: string) {
    return this.grievanceSubCategoryService.permanentDeleteGrievanceSubCategory(+id);
  }
}
