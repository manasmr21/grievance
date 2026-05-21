import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HostelBlock } from './models/hostelBlock.model';
import { HostelBlockDto } from './dto/hostelBlock.dto';
import { handleServiceError } from 'src/utils/Error/errorHandler';
import { Hostel } from '../hostel/models/hostel.model';
import { EmployeeDetails } from '../employeeDetails/models/employeeDetails.model';

@Injectable()
export class HostelBlockService {
    constructor(
        @InjectModel(HostelBlock)
        private hostelBlockModel: typeof HostelBlock,
        @InjectModel(Hostel)
        private hostelModel: typeof Hostel,
        @InjectModel(EmployeeDetails)
        private employeeModel: typeof EmployeeDetails,
    ) { }

    async createHostelBlock(data: HostelBlockDto): Promise<any> {
        try {
            const { hostel_id } = data;
            const hostelExists = await this.hostelModel.findOne({
                where: { id: hostel_id, is_active: true }
            });
            if (!hostelExists) {
                throw new HttpException('Hostel not found or inactive', 404);
            }

            const block = await this.hostelBlockModel.create(data);

            if (data.warden_employee_id) {
                await this.employeeModel.update(
                    { hostel_id: hostel_id, hostel_block_id: block.id },
                    { where: { id: data.warden_employee_id } }
                );
            }

            return {
                success: true,
                message: 'Hostel block created successfully',
                data: block,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getAllHostelBlocks(): Promise<any> {
        try {
            const blocks = await this.hostelBlockModel.findAll({
                where: { is_active: true },
                include: [Hostel],
            });
            return {
                success: true,
                message: 'Hostel blocks fetched successfully',
                data: blocks,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getHostelBlockById(id: number): Promise<any> {
        try {
            const block = await this.hostelBlockModel.findOne({
                where: { id, is_active: true },
                include: [Hostel],
            });
            if (!block) {
                throw new HttpException('Hostel block not found', 404);
            }
            return {
                success: true,
                message: 'Hostel block fetched successfully',
                data: block,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async updateHostelBlock(id: number, data: Partial<HostelBlockDto>): Promise<any> {
        try {
            const [affectedCount, blocks] = await this.hostelBlockModel.update(data, {
                where: { id, is_active: true },
                returning: true,
            });

            if (affectedCount === 0) {
                throw new HttpException('Hostel block not found', 404);
            }

            if (data.warden_employee_id) {
                const block = blocks[0];
                await this.employeeModel.update(
                    { hostel_id: block.hostel_id, hostel_block_id: block.id },
                    { where: { id: data.warden_employee_id } }
                );
            }

            return {
                success: true,
                message: 'Hostel block updated successfully',
                data: blocks[0],
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async deleteHostelBlock(id: number): Promise<any> {
        try {
            const block = await this.hostelBlockModel.findOne({ where: { id, is_active: true } });
            if (!block) {
                throw new HttpException('Hostel block not found', 404);
            }
            await block.update({ is_active: false });
            return {
                success: true,
                message: 'Hostel block deactivated successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async permanentDeleteHostelBlock(id: number): Promise<any> {
        try {
            const block = await this.hostelBlockModel.findByPk(id);
            if (!block) {
                throw new HttpException('Hostel block not found', 404);
            }
            await block.destroy();
            return {
                success: true,
                message: 'Hostel block permanently deleted successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
