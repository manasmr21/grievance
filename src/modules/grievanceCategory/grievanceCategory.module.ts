import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GrievanceCategoryService } from './grievanceCategory.service';
import { GrievanceCategoryController } from './grievanceCategory.controller';
import { GrievanceCategory } from './models/grievanceCategory.model';

@Module({
  imports: [SequelizeModule.forFeature([GrievanceCategory])],
  providers: [GrievanceCategoryService],
  controllers: [GrievanceCategoryController],
  exports: [GrievanceCategoryService],
})
export class GrievanceCategoryModule {}
