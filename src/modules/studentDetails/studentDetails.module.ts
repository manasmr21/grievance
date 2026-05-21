import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentDetails } from './models/studentDetails.model';
import { StudentDetailsService } from './studentDetails.service';
import { StudentDetailsController } from './studentDetails.controller';
import { Department } from '../department/models/department.model';
import { Hostel } from '../hostel/models/hostel.model';
import { HostelRoom } from '../hostelRoom/models/hostelRoom.model';
import { HostelBlock } from '../hostelBlock/models/hostelBlock.model';

@Module({
    imports: [
        SequelizeModule.forFeature([
            StudentDetails,
            Department,
            Hostel,
            HostelRoom,
            HostelBlock
        ])
    ],
    controllers: [StudentDetailsController],
    providers: [StudentDetailsService],
    exports: [StudentDetailsService],
})
export class StudentDetailsModule { }
