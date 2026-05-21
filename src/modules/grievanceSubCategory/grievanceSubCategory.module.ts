import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GrievanceSubCategoryService } from './grievanceSubCategory.service';
import { GrievanceSubCategoryController } from './grievanceSubCategory.controller';
import { GrievanceSubCategory } from './models/grievanceSubCategory.model';
import { GrievanceCategory } from '../grievanceCategory/models/grievanceCategory.model';

@Module({
  imports: [SequelizeModule.forFeature([GrievanceSubCategory, GrievanceCategory])],
  providers: [GrievanceSubCategoryService],
  controllers: [GrievanceSubCategoryController],
  exports: [GrievanceSubCategoryService],
})
export class GrievanceSubCategoryModule {}
