import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { StudentDetailsService } from './studentDetails.service';
import { StudentDetailsDto } from './dto/studentDetails.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Student Details')
@Controller('student-details')
export class StudentDetailsController {
    constructor(private readonly studentDetailsService: StudentDetailsService) { }

    @Post('register')
    @ApiOperation({ summary: 'Create new student details' })
    register(@Body() data: StudentDetailsDto) {
        return this.studentDetailsService.createStudentDetails(data);
    }

    @Get()
    @ApiOperation({ summary: 'Get all active student details' })
    findAll() {
        return this.studentDetailsService.getAllStudentDetails();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get student details by ID' })
    findOne(@Param('id') id: string) {
        return this.studentDetailsService.getStudentDetailsById(id);
    }

    @Put('update/:id')
    @ApiOperation({ summary: 'Update student details' })
    @ApiBody({ type: StudentDetailsDto })
    update(@Param('id') id: string, @Body() data: Partial<StudentDetailsDto>) {
        return this.studentDetailsService.updateStudentDetails(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete student details (deactivate)' })
    remove(@Param('id') id: string) {
        return this.studentDetailsService.deleteStudentDetails(id);
    }

    @Delete('permanent/:id')
    @ApiOperation({ summary: 'Permanently delete student details' })
    permanentRemove(@Param('id') id: string) {
        return this.studentDetailsService.permanentDeleteStudentDetails(id);
    }
}
