import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Hostel } from "./models/hostel.model";
import { HostelDto } from "./dto/hostel.dto";
import { handleServiceError } from "src/utils/Error/errorHandler";
import { HostelRoom } from "../hostelRoom/models/hostelRoom.model";
import { Op } from "sequelize";
import { EmployeeDetails } from "../employeeDetails/models/employeeDetails.model";

@Injectable()
export class HostelService {
    constructor(
        @InjectModel(Hostel)
        private hostelModel: typeof Hostel,
        @InjectModel(EmployeeDetails)
        private employeeModel: typeof EmployeeDetails,
    ) { }

    async createHostel(data: HostelDto): Promise<any> {
        try {
            const { name, code } = data;

            if (!name || !code) {
                throw new HttpException('Hostel name and code are required', 400);
            }

            const existingHostel = await this.hostelModel.findOne({
                where: { code }
            });

            if (existingHostel) {
                throw new HttpException('Hostel with this code already exists', 400);
            }

            const hostel = await this.hostelModel.create(data);

            if (data.default_warden_employee_id) {
                await this.employeeModel.update(
                    { hostel_id: hostel.id },
                    { where: { id: data.default_warden_employee_id } }
                );
            }

            return {
                success: true,
                message: 'Hostel created successfully',
                data: hostel,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getAllHostels(): Promise<any> {
        try {
            const hostels = await this.hostelModel.findAll({
                where: { is_active: true },
                attributes: {
                    include: [
                        [
                            this.hostelModel.sequelize!.literal(`(
                                SELECT COUNT(*)
                                FROM "hostel_room" AS "rooms"
                                WHERE "rooms"."hostel_id" = "Hostel"."id"
                            )`),
                            'roomCount'
                        ]
                    ]
                }
            });
            return {
                success: true,
                message: 'Hostels fetched successfully',
                data: hostels,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getHostelById(id: number): Promise<any> {
        try {
            const hostel = await this.hostelModel.findOne({
                where: { id, is_active: true },
                attributes: {
                    include: [
                        [
                            this.hostelModel.sequelize!.literal(`(
                                SELECT COUNT(*)
                                FROM "hostel_room" AS "rooms"
                                WHERE "rooms"."hostel_id" = "Hostel"."id"
                            )`),
                            'roomCount'
                        ]
                    ]
                }
            });
            if (!hostel) {
                throw new HttpException('Hostel not found or inactive', 404);
            }
            return {
                success: true,
                message: 'Hostel fetched successfully',
                data: hostel,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async updateHostel(id: number, data: Partial<HostelDto>): Promise<any> {
        try {
            if (data.code) {
                const existingHostel = await this.hostelModel.findOne({
                    where: {
                        code: data.code,
                        id: { [Op.ne]: id },
                        is_active: true
                    }
                });

                if (existingHostel) {
                    throw new HttpException('Hostel with this code already exists', 400);
                }
            }

            const [affectedCount, hostels] = await this.hostelModel.update(data, {
                where: { id, is_active: true },
                returning: true,
            });

            if (affectedCount === 0) {
                throw new HttpException('Hostel not found or inactive', 404);
            }

            if (data.default_warden_employee_id) {
                await this.employeeModel.update(
                    { hostel_id: id },
                    { where: { id: data.default_warden_employee_id } }
                );
            }

            return {
                success: true,
                message: 'Hostel updated successfully',
                data: hostels[0],
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async deleteHostel(id: number): Promise<any> {
        try {
            const hostel = await this.hostelModel.findOne({ where: { id, is_active: true } });
            if (!hostel) {
                throw new HttpException('Hostel not found', 404);
            }

            const roomsCount = await HostelRoom.count({ where: { hostel_id: id } });
            if (roomsCount > 0) {
                throw new HttpException('Cannot deactivate hostel because it has rooms assigned', 400);
            }

            await hostel.update({ is_active: false });
            return {
                success: true,
                message: 'Hostel deactivated successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async permanentDeleteHostel(id: number): Promise<any> {
        try {
            const hostel = await this.hostelModel.findByPk(id);
            if (!hostel) {
                throw new HttpException('Hostel not found', 404);
            }

            const roomsCount = await HostelRoom.count({ where: { hostel_id: id } });
            if (roomsCount > 0) {
                throw new HttpException('Cannot permanently delete hostel because it has rooms assigned', 400);
            }

            await hostel.destroy();
            return {
                success: true,
                message: 'Hostel permanently deleted successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
