import { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { CreationOptional, NonAttribute } from 'sequelize';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { StudentDetails } from '../../studentDetails/models/studentDetails.model';
import { GrievanceCategory } from '../../grievanceCategory/models/grievanceCategory.model';
import { GrievanceSubCategory } from '../../grievanceSubCategory/models/grievanceSubCategory.model';
import { TicketStatus } from '../../ticketStatus/models/ticketStatus.model';
import { TicketPriority } from '../../ticketPriority/models/ticketPriority.model';
import { HostelRoom } from '../../hostelRoom/models/hostelRoom.model';
import { Hostel } from '../../hostel/models/hostel.model';
import { HostelBlock } from '../../hostelBlock/models/hostelBlock.model';
import { EmployeeDetails } from '../../employeeDetails/models/employeeDetails.model';

@Table({
    tableName: 'grievance_details',
    timestamps: true,
})
export class Grievance extends Model<
    InferAttributes<Grievance>,
    InferCreationAttributes<Grievance>
> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: CreationOptional<string>;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare public_ticket_no: string;

    @ForeignKey(() => StudentDetails)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare student_id: string;

    @BelongsTo(() => StudentDetails)
    declare student: NonAttribute<StudentDetails>;

    @ForeignKey(() => GrievanceCategory)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare category_id: number;

    @BelongsTo(() => GrievanceCategory)
    declare category: NonAttribute<GrievanceCategory>;

    @ForeignKey(() => GrievanceSubCategory)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare sub_category_id: number;

    @BelongsTo(() => GrievanceSubCategory)
    declare subCategory: NonAttribute<GrievanceSubCategory>;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare subject: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare description: string;

    @ForeignKey(() => TicketStatus)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare status_id: number;

    @BelongsTo(() => TicketStatus)
    declare status: NonAttribute<TicketStatus>;

    @ForeignKey(() => TicketPriority)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare priority_id: number;

    @BelongsTo(() => TicketPriority)
    declare priority: NonAttribute<TicketPriority>;

    @ForeignKey(() => HostelRoom)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare room_no_id: CreationOptional<number>;

    @BelongsTo(() => HostelRoom)
    declare room: NonAttribute<HostelRoom>;

    @ForeignKey(() => Hostel)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare hostel_id: CreationOptional<number>;

    @BelongsTo(() => Hostel)
    declare hostel: NonAttribute<Hostel>;

    @ForeignKey(() => HostelBlock)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare hostel_block_id: CreationOptional<number>;

    @BelongsTo(() => HostelBlock)
    declare block: NonAttribute<HostelBlock>;

    @ForeignKey(() => EmployeeDetails)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    declare current_assigned_employee_id: CreationOptional<string>;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare department: CreationOptional<number>;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare class_of: CreationOptional<number>;

    @BelongsTo(() => EmployeeDetails)
    declare assignedEmployee: NonAttribute<EmployeeDetails>;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare first_response_at: CreationOptional<Date>;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare resolved_at: CreationOptional<Date>;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare sla_due_at: CreationOptional<Date>;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    declare createdAt: CreationOptional<Date>;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    declare updatedAt: CreationOptional<Date>;
}
