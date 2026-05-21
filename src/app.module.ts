import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CaptchaModule } from './modules/captcha/captcha.module';
import { RolesModule } from './modules/roles/roles.module';
import { DepartmentModule } from './modules/department/department.module';
import { HostelModule } from './modules/hostel/hostel.module';
import { UserAccountModule } from './modules/userAccount/userAccount.module';
import { TicketPriorityModule } from './modules/ticketPriority/ticketPriority.module';
import { TicketStatusModule } from './modules/ticketStatus/ticketStatus.module';
import { GrievanceCategoryModule } from './modules/grievanceCategory/grievanceCategory.module';
import { GrievanceSubCategoryModule } from './modules/grievanceSubCategory/grievanceSubCategory.module';
import { HostelRoomModule } from './modules/hostelRoom/hostelRoom.module';
import { EmployeeDetailsModule } from './modules/employeeDetails/employeeDetails.module';
import { StudentDetailsModule } from './modules/studentDetails/studentDetails.module';
import { HostelBlockModule } from './modules/hostelBlock/hostelBlock.module';
import { GrievancesModule } from './modules/grievances/grievances.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    SequelizeModule.forRoot(databaseConfig),
    CaptchaModule,
    RolesModule,
    DepartmentModule,
    HostelModule,
    UserAccountModule,
    TicketPriorityModule,
    TicketStatusModule,
    GrievanceCategoryModule,
    GrievanceSubCategoryModule,
    HostelRoomModule,
    EmployeeDetailsModule,
    StudentDetailsModule,
    HostelBlockModule,
    GrievancesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

