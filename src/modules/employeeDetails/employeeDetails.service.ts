import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { EmployeeDetails } from "./models/employeeDetails.model";
import { EmployeeDetailsDto } from "./dto/employeeDetails.dto";
import { handleServiceError } from "src/utils/Error/errorHandler";
import { Department } from "../department/models/department.model";
import { Hostel } from "../hostel/models/hostel.model";
import { HostelBlock } from "../hostelBlock/models/hostelBlock.model";
import { Role } from "../roles/models/roles.model";
import { Op } from "sequelize";

@Injectable()
export class EmployeeDetailsService {
    constructor(
        @InjectModel(EmployeeDetails)
        private employeeDetailsModel: typeof EmployeeDetails,
        @InjectModel(Department)
        private departmentModel: typeof Department,
        @InjectModel(Hostel)
        private hostelModel: typeof Hostel,
        @InjectModel(HostelBlock)
        private hostelBlockModel: typeof HostelBlock,
        @InjectModel(Role)
        private roleModel: typeof Role,
    ) { }

    async createEmployeeDetails(data: EmployeeDetailsDto): Promise<any> {
        try {
            const { name, department_id, hostel_id, role_id } = data;

            if (!name || !role_id) {
                throw new HttpException('Name and role_id are required', 400);
            }

            const roleExists = await this.roleModel.findByPk(role_id);
            if (!roleExists) {
                throw new HttpException('Role not found', 404);
            }

            if (department_id) {
                const departmentExists = await this.departmentModel.findByPk(department_id);
                if (!departmentExists) {
                    throw new HttpException('Department not found', 404);
                }
            }

            if (hostel_id) {
                const hostelExists = await this.hostelModel.findByPk(hostel_id);
                if (!hostelExists) {
                    throw new HttpException('Hostel not found', 404);
                }
            }

            if (data.hostel_block_id) {
                const blockExists = await this.hostelBlockModel.findByPk(data.hostel_block_id);
                if (!blockExists) {
                    throw new HttpException('Hostel block not found', 404);
                }
            }

            const employee = await this.employeeDetailsModel.create(data);
            return {
                success: true,
                message: 'Employee details created successfully',
                data: employee,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getAllEmployeeDetails(): Promise<any> {
        try {
            const employees = await this.employeeDetailsModel.findAll({
                where: { is_active: true },
                include: [Department, Hostel, HostelBlock, Role],
            });
            return {
                success: true,
                message: 'Employee details fetched successfully',
                data: employees,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getEmployeeDetailsById(id: string): Promise<any> {
        try {
            const employee = await this.employeeDetailsModel.findOne({
                where: { id, is_active: true },
                include: [Department, Hostel, HostelBlock, Role],
            });
            if (!employee) {
                throw new HttpException('Employee details not found or inactive', 404);
            }
            return {
                success: true,
                message: 'Employee details fetched successfully',
                data: employee,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async updateEmployeeDetails(id: string, data: Partial<EmployeeDetailsDto>): Promise<any> {
        try {
            if (data.role_id) {
                const roleExists = await this.roleModel.findByPk(data.role_id);
                if (!roleExists) {
                    throw new HttpException('Role not found', 404);
                }
            }

            if (data.department_id) {
                const departmentExists = await this.departmentModel.findByPk(data.department_id);
                if (!departmentExists) {
                    throw new HttpException('Department not found', 404);
                }
            }

            if (data.hostel_id) {
                const hostelExists = await this.hostelModel.findByPk(data.hostel_id);
                if (!hostelExists) {
                    throw new HttpException('Hostel not found', 404);
                }
            }

            if (data.hostel_block_id) {
                const blockExists = await this.hostelBlockModel.findByPk(data.hostel_block_id);
                if (!blockExists) {
                    throw new HttpException('Hostel block not found', 404);
                }
            }

            const [affectedCount, employees] = await this.employeeDetailsModel.update(data, {
                where: { id, is_active: true },
                returning: true,
            });

            if (affectedCount === 0) {
                throw new HttpException('Employee details not found or inactive', 404);
            }

            return {
                success: true,
                message: 'Employee details updated successfully',
                data: employees[0],
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async deleteEmployeeDetails(id: string): Promise<any> {
        try {
            const employee = await this.employeeDetailsModel.findOne({ where: { id, is_active: true } });
            if (!employee) {
                throw new HttpException('Employee details not found', 404);
            }
            await employee.update({ is_active: false });
            return {
                success: true,
                message: 'Employee details deactivated successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async permanentDeleteEmployeeDetails(id: string): Promise<any> {
        try {
            const employee = await this.employeeDetailsModel.findByPk(id);
            if (!employee) {
                throw new HttpException('Employee details not found', 404);
            }
            await employee.destroy();
            return {
                success: true,
                message: 'Employee details permanently deleted successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
