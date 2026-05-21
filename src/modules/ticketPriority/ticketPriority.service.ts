import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { TicketPriority } from "./models/ticketPriority.model";
import { TicketPriorityDto } from "./dto/ticketPriority.dto";
import { handleServiceError } from "src/utils/Error/errorHandler";
import { Op } from "sequelize";

@Injectable()
export class TicketPriorityService {
    constructor(
        @InjectModel(TicketPriority)
        private ticketPriorityModel: typeof TicketPriority,
    ) { }

    async createTicketPriority(data: TicketPriorityDto): Promise<any> {
        try {
            const { name, code } = data;

            if (!name || !code) {
                throw new HttpException('Name and code are required', 400);
            }

            const existingPriority = await this.ticketPriorityModel.findOne({
                where: { code }
            });

            if (existingPriority) {
                throw new HttpException('Priority with this code already exists', 400);
            }

            const priority = await this.ticketPriorityModel.create(data);
            return {
                success: true,
                message: 'Ticket Priority created successfully',
                data: priority,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getAllTicketPriorities(): Promise<any> {
        try {
            const priorities = await this.ticketPriorityModel.findAll({
                where: { is_active: true }
            });
            return {
                success: true,
                message: 'Ticket Priorities fetched successfully',
                data: priorities,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getTicketPriorityById(id: number): Promise<any> {
        try {
            const priority = await this.ticketPriorityModel.findOne({
                where: { id, is_active: true }
            });
            if (!priority) {
                throw new HttpException('Ticket Priority not found or inactive', 404);
            }
            return {
                success: true,
                message: 'Ticket Priority fetched successfully',
                data: priority,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async updateTicketPriority(id: number, data: Partial<TicketPriorityDto>): Promise<any> {
        try {
            if (data.code) {
                const existingPriority = await this.ticketPriorityModel.findOne({
                    where: {
                        code: data.code,
                        id: { [Op.ne]: id },
                        is_active: true
                    }
                });

                if (existingPriority) {
                    throw new HttpException('Priority with this code already exists', 400);
                }
            }

            const [affectedCount, priorities] = await this.ticketPriorityModel.update(data, {
                where: { id, is_active: true },
                returning: true,
            });

            if (affectedCount === 0) {
                throw new HttpException('Ticket Priority not found or inactive', 404);
            }

            return {
                success: true,
                message: 'Ticket Priority updated successfully',
                data: priorities[0],
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async deleteTicketPriority(id: number): Promise<any> {
        try {
            const priority = await this.ticketPriorityModel.findOne({ where: { id, is_active: true } });
            if (!priority) {
                throw new HttpException('Ticket Priority not found', 404);
            }
            await priority.update({ is_active: false });
            return {
                success: true,
                message: 'Ticket Priority deactivated successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async permanentDeleteTicketPriority(id: number): Promise<any> {
        try {
            const priority = await this.ticketPriorityModel.findByPk(id);
            if (!priority) {
                throw new HttpException('Ticket Priority not found', 404);
            }
            await priority.destroy();
            return {
                success: true,
                message: 'Ticket Priority permanently deleted successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
