import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentDetails } from './models/studentDetails.model';
import { StudentDetailsDto } from './dto/studentDetails.dto';
import { Department } from '../department/models/department.model';
import { Hostel } from '../hostel/models/hostel.model';
import { HostelRoom } from '../hostelRoom/models/hostelRoom.model';
import { HostelBlock } from '../hostelBlock/models/hostelBlock.model';
import { Op } from 'sequelize';
import { handleServiceError } from 'src/utils/Error/errorHandler';

@Injectable()
export class StudentDetailsService {
    constructor(
        @InjectModel(StudentDetails)
        private studentDetailsModel: typeof StudentDetails,
        @InjectModel(Department)
        private departmentModel: typeof Department,
        @InjectModel(Hostel)
        private hostelModel: typeof Hostel,
        @InjectModel(HostelRoom)
        private hostelRoomModel: typeof HostelRoom,
        @InjectModel(HostelBlock)
        private hostelBlockModel: typeof HostelBlock,
    ) { }

    async createStudentDetails(data: StudentDetailsDto): Promise<any> {
        try {
            const { registration_number, department_id, hostel_id, hostel_room_id, hostel_block_id } = data;

            // Check if registration number already exists
            const existingStudent = await this.studentDetailsModel.findOne({
                where: { registration_number }
            });
            if (existingStudent) {
                throw new HttpException('Student with this registration number already exists', 400);
            }

            // Validate Department
            const departmentExists = await this.departmentModel.findOne({
                where: { id: department_id, is_active: true }
            });
            if (!departmentExists) {
                throw new HttpException('Department not found or inactive', 404);
            }

            // Validate Hostel if provided
            if (hostel_id) {
                const hostelExists = await this.hostelModel.findOne({
                    where: { id: hostel_id, is_active: true }
                });
                if (!hostelExists) {
                    throw new HttpException('Hostel not found or inactive', 404);
                }
            }

            // Validate Hostel Block if provided
            if (hostel_block_id) {
                const blockExists = await this.hostelBlockModel.findOne({
                    where: { id: hostel_block_id, is_active: true }
                });
                if (!blockExists) {
                    throw new HttpException('Hostel block not found or inactive', 404);
                }
            }

            // Validate Hostel Room if provided
            if (hostel_room_id) {
                const roomExists = await this.hostelRoomModel.findByPk(hostel_room_id);
                if (!roomExists) {
                    throw new HttpException('Hostel room not found', 404);
                }
            }

            const student = await this.studentDetailsModel.create(data);
            return {
                success: true,
                message: 'Student details created successfully',
                data: student,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getAllStudentDetails(): Promise<any> {
        try {
            const students = await this.studentDetailsModel.findAll({
                where: { is_active: true },
                include: [Department, Hostel, HostelRoom, HostelBlock],
            });
            return {
                success: true,
                message: 'Student details fetched successfully',
                data: students,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getStudentDetailsById(id: string): Promise<any> {
        try {
            const student = await this.studentDetailsModel.findOne({
                where: { id, is_active: true },
                include: [Department, Hostel, HostelRoom, HostelBlock],
            });
            if (!student) {
                throw new HttpException('Student details not found or inactive', 404);
            }
            return {
                success: true,
                message: 'Student details fetched successfully',
                data: student,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async updateStudentDetails(id: string, data: Partial<StudentDetailsDto>): Promise<any> {
        try {
            if (data.registration_number) {
                const existingStudent = await this.studentDetailsModel.findOne({
                    where: {
                        registration_number: data.registration_number,
                        id: { [Op.ne]: id },
                        is_active: true
                    }
                });
                if (existingStudent) {
                    throw new HttpException('Student with this registration number already exists', 400);
                }
            }

            const [affectedCount, students] = await this.studentDetailsModel.update(data, {
                where: { id, is_active: true },
                returning: true,
            });

            if (affectedCount === 0) {
                throw new HttpException('Student details not found or inactive', 404);
            }

            return {
                success: true,
                message: 'Student details updated successfully',
                data: students[0],
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async deleteStudentDetails(id: string): Promise<any> {
        try {
            const student = await this.studentDetailsModel.findOne({ where: { id, is_active: true } });
            if (!student) {
                throw new HttpException('Student details not found', 404);
            }
            await student.update({ is_active: false });
            return {
                success: true,
                message: 'Student details deactivated successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async permanentDeleteStudentDetails(id: string): Promise<any> {
        try {
            const student = await this.studentDetailsModel.findByPk(id);
            if (!student) {
                throw new HttpException('Student details not found', 404);
            }
            await student.destroy();
            return {
                success: true,
                message: 'Student details permanently deleted successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
