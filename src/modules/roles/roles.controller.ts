import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './models/roles.model';
import { RoleDto } from './dto/roles.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post('create')
  create(@Body() data: RoleDto) {
    return this.rolesService.createRole(data);
  }

  @Get()
  findAll() {
    return this.rolesService.getAllRoles();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.getRoleById(+id);
  }

  @Put('update/:id')
  @ApiBody({ type: RoleDto })
  update(@Param('id') id: string, @Body() data: Partial<RoleDto>) {
    return this.rolesService.updateRole(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.deleteRole(+id);
  }

  @Delete('permanent/:id')
  permanentRemove(@Param('id') id: string) {
    return this.rolesService.permanentDeleteRole(+id);
  }
}
