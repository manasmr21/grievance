import { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { CreationOptional, NonAttribute } from 'sequelize';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Department } from '../../department/models/department.model';
import { Hostel } from '../../hostel/models/hostel.model';
import { HostelBlock } from '../../hostelBlock/models/hostelBlock.model';
import { Role } from '../../roles/models/roles.model';

@Table({
    tableName: 'employee_details',
    timestamps: true,
})
export class EmployeeDetails extends Model<
    InferAttributes<EmployeeDetails>,
    InferCreationAttributes<EmployeeDetails>
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

    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare role_id: number;

    @BelongsTo(() => Role)
    declare role: NonAttribute<Role>;

    @ForeignKey(() => Department)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare department_id: CreationOptional<number>;

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

    @ForeignKey(() => HostelBlock)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare hostel_block_id: CreationOptional<number>;

    @BelongsTo(() => HostelBlock)
    declare block: NonAttribute<HostelBlock>;

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
