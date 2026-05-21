import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Grievance } from "./models/grievance.model";
import { GrievancesService } from "./grievances.service";
import { GrievancesController } from "./grievances.controller";
import { StudentDetails } from "../studentDetails/models/studentDetails.model";
import { GrievanceCategory } from "../grievanceCategory/models/grievanceCategory.model";
import { GrievanceSubCategory } from "../grievanceSubCategory/models/grievanceSubCategory.model";
import { TicketStatus } from "../ticketStatus/models/ticketStatus.model";
import { TicketPriority } from "../ticketPriority/models/ticketPriority.model";
import { HostelRoom } from "../hostelRoom/models/hostelRoom.model";
import { Hostel } from "../hostel/models/hostel.model";
import { HostelBlock } from "../hostelBlock/models/hostelBlock.model";
import { EmployeeDetails } from "../employeeDetails/models/employeeDetails.model";
import { GrievanceExecution } from "./models/grievanceExecution.model";
import { Department } from "../department/models/department.model";

@Module({
    imports: [
        SequelizeModule.forFeature([
            Grievance,
            StudentDetails,
            GrievanceCategory,
            GrievanceSubCategory,
            TicketStatus,
            TicketPriority,
            HostelRoom,
            Hostel,
            HostelBlock,
            EmployeeDetails,
            GrievanceExecution,
            Department,
        ]),
    ],
    providers: [GrievancesService],
    controllers: [GrievancesController],
    exports: [GrievancesService],
})
export class GrievancesModule { }
