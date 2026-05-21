import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { GrievanceCategory } from "./models/grievanceCategory.model";
import { GrievanceCategoryDto } from "./dto/grievanceCategory.dto";
import { handleServiceError } from "src/utils/Error/errorHandler";
import { Op } from "sequelize";

@Injectable()
export class GrievanceCategoryService {
    constructor(
        @InjectModel(GrievanceCategory)
        private grievanceCategoryModel: typeof GrievanceCategory,
    ) { }

    async createGrievanceCategory(data: GrievanceCategoryDto): Promise<any> {
        try {
            const { name, code } = data;

            if (!name || !code) {
                throw new HttpException('Name and code are required', 400);
            }

            const existingCategory = await this.grievanceCategoryModel.findOne({
                where: { code }
            });

            if (existingCategory) {
                throw new HttpException('Category with this code already exists', 400);
            }

            const category = await this.grievanceCategoryModel.create(data);
            return {
                success: true,
                message: 'Grievance Category created successfully',
                data: category,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getAllGrievanceCategories(): Promise<any> {
        try {
            const categories = await this.grievanceCategoryModel.findAll({
                where: { is_active: true }
            });
            return {
                success: true,
                message: 'Grievance Categories fetched successfully',
                data: categories,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getGrievanceCategoryById(id: number): Promise<any> {
        try {
            const category = await this.grievanceCategoryModel.findOne({
                where: { id, is_active: true }
            });
            if (!category) {
                throw new HttpException('Grievance Category not found or inactive', 404);
            }
            return {
                success: true,
                message: 'Grievance Category fetched successfully',
                data: category,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async updateGrievanceCategory(id: number, data: Partial<GrievanceCategoryDto>): Promise<any> {
        try {
            if (data.code) {
                const existingCategory = await this.grievanceCategoryModel.findOne({
                    where: {
                        code: data.code,
                        id: { [Op.ne]: id },
                        is_active: true
                    }
                });

                if (existingCategory) {
                    throw new HttpException('Category with this code already exists', 400);
                }
            }

            const [affectedCount, categories] = await this.grievanceCategoryModel.update(data, {
                where: { id, is_active: true },
                returning: true,
            });

            if (affectedCount === 0) {
                throw new HttpException('Grievance Category not found or inactive', 404);
            }

            return {
                success: true,
                message: 'Grievance Category updated successfully',
                data: categories[0],
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async deleteGrievanceCategory(id: number): Promise<any> {
        try {
            const category = await this.grievanceCategoryModel.findOne({ where: { id, is_active: true } });
            if (!category) {
                throw new HttpException('Grievance Category not found', 404);
            }
            await category.update({ is_active: false });
            return {
                success: true,
                message: 'Grievance Category deactivated successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async permanentDeleteGrievanceCategory(id: number): Promise<any> {
        try {
            const category = await this.grievanceCategoryModel.findByPk(id);
            if (!category) {
                throw new HttpException('Grievance Category not found', 404);
            }
            await category.destroy();
            return {
                success: true,
                message: 'Grievance Category permanently deleted successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
