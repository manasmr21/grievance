import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { EmployeeDetails } from "./models/employeeDetails.model";
import { EmployeeDetailsService } from "./employeeDetails.service";
import { EmployeeDetailsController } from "./employeeDetails.controller";
import { Department } from "../department/models/department.model";
import { Hostel } from "../hostel/models/hostel.model";
import { HostelBlock } from "../hostelBlock/models/hostelBlock.model";
import { Role } from "../roles/models/roles.model";

@Module({
    imports: [SequelizeModule.forFeature([EmployeeDetails, Department, Hostel, HostelBlock, Role])],
    providers: [EmployeeDetailsService],
    controllers: [EmployeeDetailsController],
    exports: [EmployeeDetailsService],
})
export class EmployeeDetailsModule { }
