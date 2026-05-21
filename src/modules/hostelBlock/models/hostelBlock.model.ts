import { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { CreationOptional, NonAttribute } from 'sequelize';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Hostel } from '../../hostel/models/hostel.model';
import { HostelRoom } from '../../hostelRoom/models/hostelRoom.model';

@Table({
    tableName: 'hostel_block',
    timestamps: true,
})
export class HostelBlock extends Model<
    InferAttributes<HostelBlock>,
    InferCreationAttributes<HostelBlock>
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

    @ForeignKey(() => Hostel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare hostel_id: number;

    @BelongsTo(() => Hostel)
    declare hostel: NonAttribute<Hostel>;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare warden_employee_id: CreationOptional<string>;

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

    @HasMany(() => HostelRoom)
    declare rooms: NonAttribute<HostelRoom[]>;
}
