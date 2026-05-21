import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "./models/roles.model";
import { RoleDto } from "./dto/roles.dto";
import { handleServiceError } from "src/utils/Error/errorHandler";
import { Op } from "sequelize";

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role)
        private roleModel: typeof Role,
    ) { }

    async createRole(data: RoleDto): Promise<any> {
        try {
            const { name, code } = data;

            if (!name || !code) {
                throw new HttpException('Role name and code are required', 400);
            }

            const existingRole = await this.roleModel.findOne({
                where: { code }
            });

            if (existingRole) {
                throw new HttpException('Role with this code already exists', 400);
            }

            const role = await this.roleModel.create(data);
            return {
                success: true,
                message: 'Role created successfully',
                data: role,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getAllRoles(): Promise<any> {
        try {
            const roles = await this.roleModel.findAll({
                where: { is_active: true }
            });
            return {
                success: true,
                message: 'Roles fetched successfully',
                data: roles,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getRoleById(id: number): Promise<any> {
        try {
            const role = await this.roleModel.findOne({
                where: { id, is_active: true }
            });
            if (!role) {
                throw new HttpException('Role not found or inactive', 404);
            }
            return {
                success: true,
                message: 'Role fetched successfully',
                data: role,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async updateRole(id: number, data: Partial<RoleDto>): Promise<any> {
        try {
            if (data.code) {
                const existingRole = await this.roleModel.findOne({
                    where: {
                        code: data.code,
                        id: { [Op.ne]: id },
                        is_active: true
                    }
                });

                if (existingRole) {
                    throw new HttpException('Role with this code already exists', 400);
                }
            }

            const [affectedCount, roles] = await this.roleModel.update(data, {
                where: { id, is_active: true },
                returning: true,
            });

            if (affectedCount === 0) {
                throw new HttpException('Role not found or inactive', 404);
            }

            return {
                success: true,
                message: 'Role updated successfully',
                data: roles[0],
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async deleteRole(id: number): Promise<any> {
        try {
            const role = await this.roleModel.findOne({ where: { id, is_active: true } });
            if (!role) {
                throw new HttpException('Role not found', 404);
            }
            await role.update({ is_active: false });
            return {
                success: true,
                message: 'Role deactivated successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async permanentDeleteRole(id: number): Promise<any> {
        try {
            const role = await this.roleModel.findByPk(id);
            if (!role) {
                throw new HttpException('Role not found', 404);
            }
            await role.destroy();
            return {
                success: true,
                message: 'Role permanently deleted successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
