import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { HostelRoom } from "./models/hostelRoom.model";
import { HostelRoomDto } from "./dto/hostelRoom.dto";
import { Hostel } from "../hostel/models/hostel.model";
import { HostelBlock } from "../hostelBlock/models/hostelBlock.model";
import { handleServiceError } from "src/utils/Error/errorHandler";

@Injectable()
export class HostelRoomService {
    constructor(
        @InjectModel(HostelRoom)
        private hostelRoomModel: typeof HostelRoom,
        @InjectModel(Hostel)
        private hostelModel: typeof Hostel,
        @InjectModel(HostelBlock)
        private hostelBlockModel: typeof HostelBlock,
    ) { }

    async createHostelRoom(data: HostelRoomDto): Promise<any> {
        try {
            const { hostel_id, room_number } = data;

            if (!hostel_id || !room_number) {
                throw new HttpException('Hostel ID and room number are required', 400);
            }

            const hostelExists = await this.hostelModel.findByPk(hostel_id);
            if (!hostelExists) {
                throw new HttpException('Hostel not found', 404);
            }

            const existing = await this.hostelRoomModel.findOne({
                where: { hostel_id, room_number },
            });

            if (existing) {
                throw new HttpException('Room already exists in this hostel', 400);
            }

            const room = await this.hostelRoomModel.create(data as any);
            return {
                success: true,
                message: 'Hostel room created successfully',
                data: room,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getAllHostelRooms(): Promise<any> {
        try {
            const rooms = await this.hostelRoomModel.findAll({
                include: [Hostel, HostelBlock],
            });
            return {
                success: true,
                message: 'Hostel rooms fetched successfully',
                data: rooms,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getHostelRoomsByHostelId(hostel_id: number): Promise<any> {
        try {
            const rooms = await this.hostelRoomModel.findAll({
                where: { hostel_id },
                include: [Hostel, HostelBlock],
            });
            return {
                success: true,
                message: 'Hostel rooms fetched successfully',
                data: rooms,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getHostelRoomById(id: number): Promise<any> {
        try {
            const room = await this.hostelRoomModel.findByPk(id, {
                include: [Hostel, HostelBlock],
            });
            if (!room) {
                throw new HttpException('Hostel room not found', 404);
            }
            return {
                success: true,
                message: 'Hostel room fetched successfully',
                data: room,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async updateHostelRoom(id: number, data: Partial<HostelRoomDto>): Promise<any> {
        try {
            if (data.hostel_id) {
                const hostelExists = await this.hostelModel.findByPk(data.hostel_id);
                if (!hostelExists) {
                    throw new HttpException('Hostel not found', 404);
                }
            }

            const [affectedCount, rooms] = await this.hostelRoomModel.update(data, {
                where: { id },
                returning: true,
            });

            if (affectedCount === 0) {
                throw new HttpException('Hostel room not found', 404);
            }

            return {
                success: true,
                message: 'Hostel room updated successfully',
                data: rooms[0],
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async deleteHostelRoom(id: number): Promise<any> {
        try {
            const room = await this.hostelRoomModel.findByPk(id);
            if (!room) {
                throw new HttpException('Hostel room not found', 404);
            }
            await room.destroy();
            return {
                success: true,
                message: 'Hostel room deleted successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
