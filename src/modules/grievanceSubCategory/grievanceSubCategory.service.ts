import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { GrievanceSubCategory } from "./models/grievanceSubCategory.model";
import { GrievanceSubCategoryDto } from "./dto/grievanceSubCategory.dto";
import { GrievanceCategory } from "../grievanceCategory/models/grievanceCategory.model";
import { handleServiceError } from "src/utils/Error/errorHandler";
import { Op } from "sequelize";

@Injectable()
export class GrievanceSubCategoryService {
    constructor(
        @InjectModel(GrievanceSubCategory)
        private grievanceSubCategoryModel: typeof GrievanceSubCategory,
        @InjectModel(GrievanceCategory)
        private grievanceCategoryModel: typeof GrievanceCategory,
    ) { }

    async createGrievanceSubCategory(data: GrievanceSubCategoryDto): Promise<any> {
        try {
            const { name, code, category_id } = data;

            if (!name || !code || !category_id) {
                throw new HttpException('Name, code and category_id are required', 400);
            }

            const categoryExists = await this.grievanceCategoryModel.findOne({
                where: { id: category_id },
            });

            if (!categoryExists) {
                throw new HttpException('Grievance Category not found', 404);
            }

            const existingSubCategory = await this.grievanceSubCategoryModel.findOne({
                where: { code }
            });

            if (existingSubCategory) {
                throw new HttpException('Sub category with this code already exists', 400);
            }

            const subCategory = await this.grievanceSubCategoryModel.create(data);
            return {
                success: true,
                message: 'Grievance Sub Category created successfully',
                data: subCategory,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getAllGrievanceSubCategories(): Promise<any> {
        try {
            const subCategories = await this.grievanceSubCategoryModel.findAll({
                where: { is_active: true },
                include: [GrievanceCategory],
            });
            return {
                success: true,
                message: 'Grievance Sub Categories fetched successfully',
                data: subCategories,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getGrievanceSubCategoriesByCategoryId(category_id: number): Promise<any> {
        try {
            const subCategories = await this.grievanceSubCategoryModel.findAll({
                where: { category_id, is_active: true },
                include: [GrievanceCategory],
            });
            return {
                success: true,
                message: 'Grievance Sub Categories fetched successfully',
                data: subCategories,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getGrievanceSubCategoryById(id: number): Promise<any> {
        try {
            const subCategory = await this.grievanceSubCategoryModel.findOne({
                where: { id, is_active: true },
                include: [GrievanceCategory],
            });
            if (!subCategory) {
                throw new HttpException('Grievance Sub Category not found or inactive', 404);
            }
            return {
                success: true,
                message: 'Grievance Sub Category fetched successfully',
                data: subCategory,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async updateGrievanceSubCategory(id: number, data: Partial<GrievanceSubCategoryDto>): Promise<any> {
        try {
            if (data.category_id) {
                const categoryExists = await this.grievanceCategoryModel.findByPk(data.category_id);
                if (!categoryExists) {
                    throw new HttpException('Grievance Category not found', 404);
                }
            }

            if (data.code) {
                const existingSubCategory = await this.grievanceSubCategoryModel.findOne({
                    where: {
                        code: data.code,
                        id: { [Op.ne]: id },
                        is_active: true
                    }
                });

                if (existingSubCategory) {
                    throw new HttpException('Sub category with this code already exists', 400);
                }
            }

            const [affectedCount, subCategories] = await this.grievanceSubCategoryModel.update(data, {
                where: { id, is_active: true },
                returning: true,
            });

            if (affectedCount === 0) {
                throw new HttpException('Grievance Sub Category not found or inactive', 404);
            }

            return {
                success: true,
                message: 'Grievance Sub Category updated successfully',
                data: subCategories[0],
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async deleteGrievanceSubCategory(id: number): Promise<any> {
        try {
            const subCategory = await this.grievanceSubCategoryModel.findOne({ where: { id, is_active: true } });
            if (!subCategory) {
                throw new HttpException('Grievance Sub Category not found', 404);
            }
            await subCategory.update({ is_active: false });
            return {
                success: true,
                message: 'Grievance Sub Category deactivated successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async permanentDeleteGrievanceSubCategory(id: number): Promise<any> {
        try {
            const subCategory = await this.grievanceSubCategoryModel.findByPk(id);
            if (!subCategory) {
                throw new HttpException('Grievance Sub Category not found', 404);
            }
            await subCategory.destroy();
            return {
                success: true,
                message: 'Grievance Sub Category permanently deleted successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
