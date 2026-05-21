import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TicketPriorityService } from './ticketPriority.service';
import { TicketPriorityDto } from './dto/ticketPriority.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Ticket Priorities')
@Controller('ticket-priority')
export class TicketPriorityController {
  constructor(private readonly ticketPriorityService: TicketPriorityService) { }

  @Post('create')
  create(@Body() data: TicketPriorityDto) {
    return this.ticketPriorityService.createTicketPriority(data);
  }

  @Get()
  findAll() {
    return this.ticketPriorityService.getAllTicketPriorities();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketPriorityService.getTicketPriorityById(+id);
  }

  @Put('update/:id')
  @ApiBody({ type: TicketPriorityDto })
  update(@Param('id') id: string, @Body() data: Partial<TicketPriorityDto>) {
    return this.ticketPriorityService.updateTicketPriority(+id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete ticket priority (deactivate)' })
  async remove(@Param('id') id: number) {
    return this.ticketPriorityService.deleteTicketPriority(id);
  }

  @Delete('permanent/:id')
  @ApiOperation({ summary: 'Permanently delete ticket priority' })
  async permanentRemove(@Param('id') id: number) {
    return this.ticketPriorityService.permanentDeleteTicketPriority(id);
  }
}