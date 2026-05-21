import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TicketPriorityService } from './ticketPriority.service';
import { TicketPriorityController } from './ticketPriority.controller';
import { TicketPriority } from './models/ticketPriority.model';

@Module({
  imports: [SequelizeModule.forFeature([TicketPriority])],
  providers: [TicketPriorityService],
  controllers: [TicketPriorityController],
  exports: [TicketPriorityService],
})
export class TicketPriorityModule {}
