import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { Department } from './models/department.model';
import { EmployeeDetails } from '../employeeDetails/models/employeeDetails.model';

@Module({
  imports: [SequelizeModule.forFeature([Department, EmployeeDetails])],
  providers: [DepartmentService],
  controllers: [DepartmentController],
  exports: [DepartmentService],
})
export class DepartmentModule {}
