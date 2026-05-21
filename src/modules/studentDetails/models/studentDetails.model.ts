import { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { CreationOptional, NonAttribute } from 'sequelize';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Department } from '../../department/models/department.model';
import { Hostel } from '../../hostel/models/hostel.model';
import { HostelRoom } from '../../hostelRoom/models/hostelRoom.model';
import { HostelBlock } from '../../hostelBlock/models/hostelBlock.model';

@Table({
    tableName: 'student_details',
    timestamps: true,
})
export class StudentDetails extends Model<
    InferAttributes<StudentDetails>,
    InferCreationAttributes<StudentDetails>
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
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: {
            name: 'student_details_registration_number_unique',
            msg: 'Registration number must be unique',
        },
    })
    declare registration_number: string;

    @ForeignKey(() => Department)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare department_id: number;

    @BelongsTo(() => Department)
    declare department: NonAttribute<Department>;

    @ForeignKey(() => Hostel)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare hostel_id: CreationOptional<number>;

    @BelongsTo(() => Hostel)
    declare hostel: NonAttribute<Hostel>;

    @ForeignKey(() => HostelRoom)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare hostel_room_id: CreationOptional<number>;

    @BelongsTo(() => HostelRoom)
    declare hostelRoom: NonAttribute<HostelRoom>;

    @ForeignKey(() => HostelBlock)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare hostel_block_id: CreationOptional<number>;

    @BelongsTo(() => HostelBlock)
    declare hostelBlock: NonAttribute<HostelBlock>;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    declare is_active: CreationOptional<boolean>;

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
