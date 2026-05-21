import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { TicketStatus } from "./models/ticketStatus.model";
import { TicketStatusDto } from "./dto/ticketStatus.dto";
import { handleServiceError } from "src/utils/Error/errorHandler";
import { Op } from "sequelize";

@Injectable()
export class TicketStatusService {
    constructor(
        @InjectModel(TicketStatus)
        private ticketStatusModel: typeof TicketStatus,
    ) { }

    async createTicketStatus(data: TicketStatusDto): Promise<any> {
        try {
            const { name, code } = data;

            if (!name || !code) {
                throw new HttpException('Name and code are required', 400);
            }

            const existingStatus = await this.ticketStatusModel.findOne({
                where: { code }
            });

            if (existingStatus) {
                throw new HttpException('Status with this code already exists', 400);
            }

            const status = await this.ticketStatusModel.create(data);
            return {
                success: true,
                message: 'Ticket Status created successfully',
                data: status,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getAllTicketStatuses(): Promise<any> {
        try {
            const statuses = await this.ticketStatusModel.findAll({
                where: { is_active: true }
            });
            return {
                success: true,
                message: 'Ticket Statuses fetched successfully',
                data: statuses,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getTicketStatusById(id: number): Promise<any> {
        try {
            const status = await this.ticketStatusModel.findOne({
                where: { id, is_active: true }
            });
            if (!status) {
                throw new HttpException('Ticket Status not found or inactive', 404);
            }
            return {
                success: true,
                message: 'Ticket Status fetched successfully',
                data: status,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async updateTicketStatus(id: number, data: Partial<TicketStatusDto>): Promise<any> {
        try {
            if (data.code) {
                const existingStatus = await this.ticketStatusModel.findOne({
                    where: {
                        code: data.code,
                        id: { [Op.ne]: id },
                        is_active: true
                    }
                });

                if (existingStatus) {
                    throw new HttpException('Status with this code already exists', 400);
                }
            }

            const [affectedCount, statuses] = await this.ticketStatusModel.update(data, {
                where: { id, is_active: true },
                returning: true,
            });

            if (affectedCount === 0) {
                throw new HttpException('Ticket Status not found or inactive', 404);
            }

            return {
                success: true,
                message: 'Ticket Status updated successfully',
                data: statuses[0],
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async deleteTicketStatus(id: number): Promise<any> {
        try {
            const status = await this.ticketStatusModel.findOne({ where: { id, is_active: true } });
            if (!status) {
                throw new HttpException('Ticket Status not found', 404);
            }
            await status.update({ is_active: false });
            return {
                success: true,
                message: 'Ticket Status deactivated successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async permanentDeleteTicketStatus(id: number): Promise<any> {
        try {
            const status = await this.ticketStatusModel.findByPk(id);
            if (!status) {
                throw new HttpException('Ticket Status not found', 404);
            }
            await status.destroy();
            return {
                success: true,
                message: 'Ticket Status permanently deleted successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
