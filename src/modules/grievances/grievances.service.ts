import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Grievance } from "./models/grievance.model";
import { GrievanceDto, UpdateGrievanceDto } from "./dto/grievance.dto";
import { handleServiceError } from "src/utils/Error/errorHandler";
import { StudentDetails } from "../studentDetails/models/studentDetails.model";
import { GrievanceCategory } from "../grievanceCategory/models/grievanceCategory.model";
import { GrievanceSubCategory } from "../grievanceSubCategory/models/grievanceSubCategory.model";
import { TicketStatus } from "../ticketStatus/models/ticketStatus.model";
import { TicketPriority } from "../ticketPriority/models/ticketPriority.model";
import { HostelRoom } from "../hostelRoom/models/hostelRoom.model";
import { Hostel } from "../hostel/models/hostel.model";
import { HostelBlock } from "../hostelBlock/models/hostelBlock.model";
import { EmployeeDetails } from "../employeeDetails/models/employeeDetails.model";
import { Role } from "../roles/models/roles.model";
import { GrievanceExecution } from "./models/grievanceExecution.model";
import { Department } from "../department/models/department.model";

@Injectable()
export class GrievancesService {
    constructor(
        @InjectModel(Grievance)
        private grievanceModel: typeof Grievance,
        @InjectModel(StudentDetails)
        private studentModel: typeof StudentDetails,
        @InjectModel(GrievanceCategory)
        private categoryModel: typeof GrievanceCategory,
        @InjectModel(GrievanceSubCategory)
        private subCategoryModel: typeof GrievanceSubCategory,
        @InjectModel(TicketStatus)
        private statusModel: typeof TicketStatus,
        @InjectModel(TicketPriority)
        private priorityModel: typeof TicketPriority,
        @InjectModel(HostelRoom)
        private roomModel: typeof HostelRoom,
        @InjectModel(Hostel)
        private hostelModel: typeof Hostel,
        @InjectModel(HostelBlock)
        private blockModel: typeof HostelBlock,
        @InjectModel(EmployeeDetails)
        private employeeModel: typeof EmployeeDetails,
        @InjectModel(GrievanceExecution)
        private grievanceExecutionModel: typeof GrievanceExecution,
        @InjectModel(Department)
        private departmentModel: typeof Department,
    ) { }

    private generateTicketNo(): string {
        const prefix = 'GRV';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${timestamp}-${random}`;
    }

    async createGrievance(data: GrievanceDto): Promise<any> {
        try {
            // Validation of Foreign Keys
            const student = await this.studentModel.findByPk(data.student_id);
            if (!student || !student.is_active) throw new HttpException('Student not found or inactive', 404);

            const category = await this.categoryModel.findByPk(data.category_id);
            if (!category || !category.is_active) throw new HttpException('Category not found or inactive', 404);

            const subCategory = await this.subCategoryModel.findByPk(data.sub_category_id);
            if (!subCategory || !subCategory.is_active) throw new HttpException('Sub-category not found or inactive', 404);

            // Auto-assign default status
            const defaultStatusCode = 'ACTIVE';
            const status = await this.statusModel.findOne({ where: { code: defaultStatusCode } });

            let assignedEmployeeId: string | null = null;
            const categoryCode = category.code ? category.code.toUpperCase() : '';
            const categoryName = category.name ? category.name.toUpperCase() : '';
            let priorityCode = 'MEDIUM';

            if (categoryCode === 'ACADEMIC' || categoryName.includes('ACADEMIC')) {
                if (data.hostel_id || data.hostel_block_id || data.room_no_id) {
                    throw new HttpException('Hostel details cannot be provided for academic grievances', 400);
                }
                if (!data.department || !data.class_of) {
                    throw new HttpException('Department and class_of are required for academic grievances', 400);
                }

                const departmentEntity = await this.departmentModel.findByPk(data.department);

                if (departmentEntity && departmentEntity.default_hod_employee_id) {
                    assignedEmployeeId = departmentEntity.default_hod_employee_id;
                } else {
                    const hod = await this.employeeModel.findOne({
                        include: [{
                            model: Role,
                            where: { code: 'HOD' }
                        }],
                        where: {
                            department_id: data.department,
                            is_active: true
                        }
                    });
                    if (hod) {
                        assignedEmployeeId = hod.id;
                    }
                }
            } else {
                if (data.department || data.class_of) {
                    throw new HttpException('Department and class_of cannot be provided for non-academic grievances', 400);
                }
                if (!data.hostel_id || !data.hostel_block_id || !data.room_no_id) {
                    throw new HttpException('Hostel details are required for this grievance category', 400);
                }

                const room = await this.roomModel.findByPk(data.room_no_id);
                if (!room) throw new HttpException('Room not found', 404);

                const hostel = await this.hostelModel.findByPk(data.hostel_id);
                if (!hostel || !hostel.is_active) throw new HttpException('Hostel not found or inactive', 404);

                priorityCode = hostel.is_special ? 'HIGH' : 'MEDIUM';

                const block = await this.blockModel.findByPk(data.hostel_block_id);
                if (!block || !block.is_active) throw new HttpException('Block not found or inactive', 404);

                if (categoryCode === 'HOSTEL' || categoryName.includes('HOSTEL')) {
                    if (block.warden_employee_id) {
                        assignedEmployeeId = block.warden_employee_id;
                    } else if (hostel.default_warden_employee_id) {
                        assignedEmployeeId = hostel.default_warden_employee_id;
                    } else {
                        const warden = await this.employeeModel.findOne({
                            include: [{
                                model: Role,
                                where: { code: 'WARDEN' }
                            }],
                            where: {
                                hostel_id: data.hostel_id,
                                is_active: true
                            }
                        });
                        if (warden) {
                            assignedEmployeeId = warden.id;
                        }
                    }
                }
            }

            const priority = await this.priorityModel.findOne({ where: { code: priorityCode } });

            const public_ticket_no = this.generateTicketNo();
            const sla_due_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

            const grievance = await this.grievanceModel.create({
                ...data,
                status_id: status?.id,
                priority_id: priority?.id,
                current_assigned_employee_id: assignedEmployeeId,
                public_ticket_no,
                sla_due_at,
            } as any);

            if (assignedEmployeeId) {
                await this.grievanceExecutionModel.create({
                    title: 'Grievance Assigned',
                    grievance_id: grievance.id,
                    from_id: data.student_id,
                    to_id: assignedEmployeeId,
                    remarks: 'Grievance auto-assigned upon creation.',
                } as any);
            }

            const fullGrievance = await this.grievanceModel.findByPk(grievance.id, {
                include: [
                    { model: GrievanceCategory },
                    { model: GrievanceSubCategory },
                    { model: TicketStatus },
                    { model: TicketPriority },
                    { model: StudentDetails },
                    { model: EmployeeDetails },
                    { model: Hostel },
                    { model: HostelBlock },
                    { model: HostelRoom },
                ]
            });

            return {
                success: true,
                message: 'Grievance created successfully',
                data: fullGrievance,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getAllGrievances(): Promise<any> {
        try {
            const grievances = await this.grievanceModel.findAll({
                include: [
                    { model: StudentDetails },
                    { model: GrievanceCategory },
                    { model: GrievanceSubCategory },
                    { model: TicketStatus },
                    { model: TicketPriority },
                    { model: HostelRoom },
                    { model: Hostel },
                    { model: HostelBlock },
                    { model: EmployeeDetails },
                ],
            });
            return {
                success: true,
                message: 'Grievances fetched successfully',
                data: grievances,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async getGrievanceById(id: string): Promise<any> {
        try {
            const grievance = await this.grievanceModel.findByPk(id, {
                include: [
                    { model: StudentDetails },
                    { model: GrievanceCategory },
                    { model: GrievanceSubCategory },
                    { model: TicketStatus },
                    { model: TicketPriority },
                    { model: HostelRoom },
                    { model: Hostel },
                    { model: HostelBlock },
                    { model: EmployeeDetails },
                ],
            });
            if (!grievance) throw new HttpException('Grievance not found', 404);
            return {
                success: true,
                message: 'Grievance fetched successfully',
                data: grievance,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async updateGrievance(id: string, data: UpdateGrievanceDto): Promise<any> {
        try {
            const [affectedCount, grievances] = await this.grievanceModel.update(data, {
                where: { id },
                returning: true,
            });

            if (affectedCount === 0) throw new HttpException('Grievance not found', 404);

            return {
                success: true,
                message: 'Grievance updated successfully',
                data: grievances[0],
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async deleteGrievance(id: string): Promise<any> {
        try {
            const grievance = await this.grievanceModel.findByPk(id);
            if (!grievance) throw new HttpException('Grievance not found', 404);
            await grievance.destroy();
            return {
                success: true,
                message: 'Grievance deleted successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async assignGrievance(id: string, employee_id: string): Promise<any> {
        try {
            const grievance = await this.grievanceModel.findByPk(id);
            if (!grievance) throw new HttpException('Grievance not found', 404);

            if (!grievance.current_assigned_employee_id) {
                throw new HttpException('Grievance is not currently assigned to anyone', 400);
            }

            const currentAssignee = await this.employeeModel.findByPk(grievance.current_assigned_employee_id, {
                include: [{ model: Role }]
            });

            if (!currentAssignee) {
                throw new HttpException('Current assigned employee not found', 404);
            }

            const roleCode = currentAssignee.role?.code?.toUpperCase();
            if (roleCode !== 'HOD' && roleCode !== 'WARDEN') {
                throw new HttpException('Only HOD and WARDEN can assign grievances for now', 403);
            }

            const newAssignee = await this.employeeModel.findByPk(employee_id);
            if (!newAssignee || !newAssignee.is_active) {
                throw new HttpException('Target employee not found or inactive', 404);
            }

            await grievance.update({
                current_assigned_employee_id: employee_id,
            });

            return {
                success: true,
                message: 'Grievance assigned successfully',
                data: grievance,
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
