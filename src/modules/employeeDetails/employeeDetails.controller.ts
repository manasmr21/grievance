import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { EmployeeDetailsService } from "./employeeDetails.service";
import { EmployeeDetailsDto, UpdateEmployeeDetailsDto } from "./dto/employeeDetails.dto";
import { ApiBody } from "@nestjs/swagger";

@ApiTags('Employee Details')
@Controller('employee-details')
export class EmployeeDetailsController {
    constructor(private readonly employeeDetailsService: EmployeeDetailsService) { }

    @Post()
    @ApiOperation({ summary: 'Create new employee details' })
    async create(@Body() data: EmployeeDetailsDto) {
        return this.employeeDetailsService.createEmployeeDetails(data);
    }

    @Get()
    @ApiOperation({ summary: 'Get all employee details' })
    async findAll() {
        return this.employeeDetailsService.getAllEmployeeDetails();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get employee details by ID' })
    async findOne(@Param('id') id: string) {
        return this.employeeDetailsService.getEmployeeDetailsById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update employee details' })
    @ApiBody({ type: UpdateEmployeeDetailsDto })
    async update(@Param('id') id: string, @Body() data: UpdateEmployeeDetailsDto) {
        return this.employeeDetailsService.updateEmployeeDetails(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete employee details (deactivate)' })
    async remove(@Param('id') id: string) {
        return this.employeeDetailsService.deleteEmployeeDetails(id);
    }

    @Delete('permanent/:id')
    @ApiOperation({ summary: 'Permanently delete employee details' })
    async permanentRemove(@Param('id') id: string) {
        return this.employeeDetailsService.permanentDeleteEmployeeDetails(id);
    }
}
