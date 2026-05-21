import { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { CreationOptional, NonAttribute } from 'sequelize';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Hostel } from '../../hostel/models/hostel.model';
import { HostelBlock } from '../../hostelBlock/models/hostelBlock.model';

@Table({
    tableName: 'hostel_room',
    timestamps: true,
})
export class HostelRoom extends Model<
    InferAttributes<HostelRoom>,
    InferCreationAttributes<HostelRoom>
> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: CreationOptional<number>;

    @ForeignKey(() => Hostel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: 'hostel_room_unique'
    })
    declare hostel_id: number;

    @BelongsTo(() => Hostel, { onDelete: 'RESTRICT' })
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
        type: DataType.STRING,
        allowNull: false,
        unique: 'hostel_room_unique'
    })
    declare room_number: string;

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
