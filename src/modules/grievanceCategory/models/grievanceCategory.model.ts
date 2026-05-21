import { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { CreationOptional, NonAttribute } from 'sequelize';
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { GrievanceSubCategory } from '../../grievanceSubCategory/models/grievanceSubCategory.model';

@Table({
    tableName: 'grievance_category',
    timestamps: true,
})
export class GrievanceCategory extends Model<
    InferAttributes<GrievanceCategory>,
    InferCreationAttributes<GrievanceCategory>
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
            name: 'grievance_category_code_unique',
            msg: 'This category already exists',
        },
    })
    declare code: string;

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

    @HasMany(() => GrievanceSubCategory, { onDelete: 'RESTRICT' })
    declare subCategories: NonAttribute<GrievanceSubCategory[]>;
}
