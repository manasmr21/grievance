import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HostelRoomService } from './hostelRoom.service';
import { HostelRoomController } from './hostelRoom.controller';
import { HostelRoom } from './models/hostelRoom.model';
import { Hostel } from '../hostel/models/hostel.model';
import { HostelBlock } from '../hostelBlock/models/hostelBlock.model';

@Module({
  imports: [SequelizeModule.forFeature([HostelRoom, Hostel, HostelBlock])],
  providers: [HostelRoomService],
  controllers: [HostelRoomController],
  exports: [HostelRoomService],
})
export class HostelRoomModule {}
