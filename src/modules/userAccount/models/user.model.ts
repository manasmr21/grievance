import { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { CreationOptional } from 'sequelize';
import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
    tableName: 'user_account',
    timestamps: true,
})
export class UserAccount extends Model<
    InferAttributes<UserAccount>,
    InferCreationAttributes<UserAccount>
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
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare role_id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'active',
    })
    declare account_status: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    declare createdAt: CreationOptional<Date>;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    declare updatedAt: CreationOptional<Date>;
}