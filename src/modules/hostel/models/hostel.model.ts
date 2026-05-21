import { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { CreationOptional, NonAttribute } from 'sequelize';
import {
    Table,
    Column,
    Model,
    DataType,
    HasMany,
} from 'sequelize-typescript';
import { HostelRoom } from '../../hostelRoom/models/hostelRoom.model';

@Table({
    tableName: 'hostel',
    timestamps: true,
})
export class Hostel extends Model<
    InferAttributes<Hostel>,
    InferCreationAttributes<Hostel>
> {

    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: CreationOptional<number>;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: {
            name: 'hostel_code_unique',
            msg: 'This hostel already exists',
        },
    })
    declare code: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare default_warden_employee_id: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare is_special: CreationOptional<boolean>;

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

    @HasMany(() => HostelRoom, { onDelete: 'RESTRICT' })
    declare rooms: NonAttribute<HostelRoom[]>;
}