import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentDto } from './dto/department.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Departments')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post('create')
  create(@Body() data: DepartmentDto) {
    return this.departmentService.createDepartment(data);
  }

  @Get()
  findAll() {
    return this.departmentService.getAllDepartments();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentService.getDepartmentById(+id);
  }

  @Put('update/:id')
  @ApiBody({ type: DepartmentDto })
  update(@Param('id') id: string, @Body() data: Partial<DepartmentDto>) {
    return this.departmentService.updateDepartment(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentService.deleteDepartment(+id);
  }

  @Delete('permanent/:id')
  permanentRemove(@Param('id') id: string) {
    return this.departmentService.permanentDeleteDepartment(+id);
  }
}
