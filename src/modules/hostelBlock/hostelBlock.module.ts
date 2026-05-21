import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HostelBlock } from './models/hostelBlock.model';
import { HostelBlockService } from './hostelBlock.service';
import { HostelBlockController } from './hostelBlock.controller';
import { Hostel } from '../hostel/models/hostel.model';
import { EmployeeDetails } from '../employeeDetails/models/employeeDetails.model';

@Module({
    imports: [
        SequelizeModule.forFeature([HostelBlock, Hostel, EmployeeDetails])
    ],
    controllers: [HostelBlockController],
    providers: [HostelBlockService],
    exports: [HostelBlockService],
})
export class HostelBlockModule { }
