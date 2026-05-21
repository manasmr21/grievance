import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HostelService } from './hostel.service';
import { HostelController } from './hostel.controller';
import { Hostel } from './models/hostel.model';
import { EmployeeDetails } from '../employeeDetails/models/employeeDetails.model';

@Module({
  imports: [SequelizeModule.forFeature([Hostel, EmployeeDetails])],
  providers: [HostelService],
  controllers: [HostelController],
  exports: [HostelService],
})
export class HostelModule {}
