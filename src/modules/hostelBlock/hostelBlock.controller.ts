import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { HostelBlockService } from './hostelBlock.service';
import { HostelBlockDto } from './dto/hostelBlock.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Hostel Blocks')
@Controller('hostel-block')
export class HostelBlockController {
    constructor(private readonly hostelBlockService: HostelBlockService) { }

    @Post('create')
    @ApiOperation({ summary: 'Create new hostel block' })
    create(@Body() data: HostelBlockDto) {
        return this.hostelBlockService.createHostelBlock(data);
    }

    @Get()
    @ApiOperation({ summary: 'Get all active hostel blocks' })
    findAll() {
        return this.hostelBlockService.getAllHostelBlocks();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get hostel block by ID' })
    findOne(@Param('id') id: string) {
        return this.hostelBlockService.getHostelBlockById(+id);
    }

    @Put('update/:id')
    @ApiOperation({ summary: 'Update hostel block' })
    @ApiBody({ type: HostelBlockDto })
    update(@Param('id') id: string, @Body() data: Partial<HostelBlockDto>) {
        return this.hostelBlockService.updateHostelBlock(+id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete hostel block' })
    remove(@Param('id') id: string) {
        return this.hostelBlockService.deleteHostelBlock(+id);
    }

    @Delete('permanent/:id')
    @ApiOperation({ summary: 'Permanently delete hostel block' })
    permanentRemove(@Param('id') id: string) {
        return this.hostelBlockService.permanentDeleteHostelBlock(+id);
    }
}
