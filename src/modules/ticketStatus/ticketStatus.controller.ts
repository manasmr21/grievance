import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TicketStatusService } from './ticketStatus.service';
import { TicketStatusDto } from './dto/ticketStatus.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Ticket Statuses')
@Controller('ticket-status')
export class TicketStatusController {
  constructor(private readonly ticketStatusService: TicketStatusService) { }

  @Post('create')
  create(@Body() data: TicketStatusDto) {
    return this.ticketStatusService.createTicketStatus(data);
  }

  @Get()
  findAll() {
    return this.ticketStatusService.getAllTicketStatuses();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketStatusService.getTicketStatusById(+id);
  }

  @Put('update/:id')
  @ApiBody({ type: TicketStatusDto })
  update(@Param('id') id: string, @Body() data: Partial<TicketStatusDto>) {
    return this.ticketStatusService.updateTicketStatus(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketStatusService.deleteTicketStatus(+id);
  }

  @Delete('permanent/:id')
  permanentRemove(@Param('id') id: string) {
    return this.ticketStatusService.permanentDeleteTicketStatus(+id);
  }
}
