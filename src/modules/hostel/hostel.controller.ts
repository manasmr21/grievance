import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { HostelService } from './hostel.service';
import { HostelDto } from './dto/hostel.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Hostels')
@Controller('hostel')
export class HostelController {
    constructor(private readonly hostelService: HostelService) { }

    @Post('create')
    create(@Body() data: HostelDto) {
        return this.hostelService.createHostel(data);
    }

    @Get()
    findAll() {
        return this.hostelService.getAllHostels();
    }

    @Get(':id')
    findOneById(@Param('id') id: string) {
        return this.hostelService.getHostelById(+id);
    }

    @Put('update/:id')
    @ApiBody({ type: HostelDto })
    update(@Param('id') id: string, @Body() data: Partial<HostelDto>) {
        return this.hostelService.updateHostel(+id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.hostelService.deleteHostel(+id);
    }

    @Delete('permanent/:id')
    permanentRemove(@Param('id') id: string) {
        return this.hostelService.permanentDeleteHostel(+id);
    }
}
