import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Department } from "./models/department.model";
import { DepartmentDto } from "./dto/department.dto";
import { handleServiceError } from "src/utils/Error/errorHandler";
import { Op } from "sequelize";
import { EmployeeDetails } from "../employeeDetails/models/employeeDetails.model";

@Injectable()
export class DepartmentService {
    constructor(
        @InjectModel(Department)
        private departmentModel: typeof Department,
        @InjectModel(EmployeeDetails)
        private employeeModel: typeof EmployeeDetails,
    ) { }

    async createDepartment(data: DepartmentDto): Promise<any> {
        try {
            const { name, code } = data;

            if (!name || !code) {
                throw new HttpException('Department name and code are required', 400);
            }

            const existingDepartment = await this.departmentModel.findOne({
                where: { code }
            });

            if (existingDepartment) {
                throw new HttpException('Department with this code already exists', 400);
            }

            const department = await this.departmentModel.create(data);

            if (data.default_hod_employee_id) {
                await this.employeeModel.update(
                    { department_id: department.id },
                    { where: { id: data.default_hod_employee_id } }
                );
            }

            return {
                success: true,
                message: 'Department created successfully',
                data: department,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getAllDepartments(): Promise<any> {
        try {
            const departments = await this.departmentModel.findAll({
                where: { is_active: true }
            });
            return {
                success: true,
                message: 'Departments fetched successfully',
                data: departments,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getDepartmentById(id: number): Promise<any> {
        try {
            const department = await this.departmentModel.findOne({
                where: { id, is_active: true }
            });
            if (!department) {
                throw new HttpException('Department not found or inactive', 404);
            }
            return {
                success: true,
                message: 'Department fetched successfully',
                data: department,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async updateDepartment(id: number, data: Partial<DepartmentDto>): Promise<any> {
        try {
            if (data.code) {
                const existingDepartment = await this.departmentModel.findOne({
                    where: {
                        code: data.code,
                        id: { [Op.ne]: id },
                        is_active: true
                    }
                });

                if (existingDepartment) {
                    throw new HttpException('Department with this code already exists', 400);
                }
            }

            const [affectedCount, departments] = await this.departmentModel.update(data, {
                where: { id, is_active: true },
                returning: true,
            });

            if (affectedCount === 0) {
                throw new HttpException('Department not found or inactive', 404);
            }

            if (data.default_hod_employee_id) {
                await this.employeeModel.update(
                    { department_id: id },
                    { where: { id: data.default_hod_employee_id } }
                );
            }

            return {
                success: true,
                message: 'Department updated successfully',
                data: departments[0],
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async deleteDepartment(id: number): Promise<any> {
        try {
            const department = await this.departmentModel.findOne({ where: { id, is_active: true } });
            if (!department) {
                throw new HttpException('Department not found', 404);
            }
            await department.update({ is_active: false });
            return {
                success: true,
                message: 'Department deactivated successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async permanentDeleteDepartment(id: number): Promise<any> {
        try {
            const department = await this.departmentModel.findByPk(id);
            if (!department) {
                throw new HttpException('Department not found', 404);
            }
            await department.destroy();
            return {
                success: true,
                message: 'Department permanently deleted successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
