import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger";
import { GrievancesService } from "./grievances.service";
import { GrievanceDto, UpdateGrievanceDto, AssignGrievanceDto } from "./dto/grievance.dto";

@ApiTags('Grievances')
@Controller('grievances')
export class GrievancesController {
    constructor(private readonly grievancesService: GrievancesService) { }

    @Post()
    @ApiOperation({ summary: 'Submit a new grievance' })
    @ApiBody({ type: GrievanceDto })
    async create(@Body() data: GrievanceDto) {
        return this.grievancesService.createGrievance(data);
    }

    @Get()
    @ApiOperation({ summary: 'Get all grievances' })
    async findAll() {
        return this.grievancesService.getAllGrievances();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get grievance by ID' })
    async findOne(@Param('id') id: string) {
        return this.grievancesService.getGrievanceById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update grievance details' })
    @ApiBody({ type: UpdateGrievanceDto })
    async update(@Param('id') id: string, @Body() data: UpdateGrievanceDto) {
        return this.grievancesService.updateGrievance(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete grievance' })
    async remove(@Param('id') id: string) {
        return this.grievancesService.deleteGrievance(id);
    }

    @Patch(':id/assign')
    @ApiOperation({ summary: 'Assign grievance to another employee' })
    @ApiBody({ type: AssignGrievanceDto })
    async assignGrievance(@Param('id') id: string, @Body() data: AssignGrievanceDto) {
        return this.grievancesService.assignGrievance(id, data.employee_id);
    }
}
