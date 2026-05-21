import { ApiProperty, PartialType } from "@nestjs/swagger";

export class GrievanceDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID of the student' })
    student_id!: string;

    @ApiProperty({ example: 1, description: 'ID of the category' })
    category_id!: number;

    @ApiProperty({ example: 1, description: 'ID of the sub-category' })
    sub_category_id!: number;

    @ApiProperty({ example: 'Water Leakage', description: 'Subject of the grievance' })
    subject!: string;

    @ApiProperty({ example: 'There is a major water leakage in the bathroom.', description: 'Detailed description' })
    description!: string;

    @ApiProperty({ example: 1, description: 'Department ID', required: false })
    department?: number;

    @ApiProperty({ example: 2024, description: 'Class of (Year)', required: false })
    class_of?: number;

    @ApiProperty({ example: 1, description: 'ID of the hostel room', required: false })
    room_no_id?: number;

    @ApiProperty({ example: 1, description: 'ID of the hostel', required: false })
    hostel_id?: number;

    @ApiProperty({ example: 1, description: 'ID of the hostel block', required: false })
    hostel_block_id?: number;
}

export class UpdateGrievanceDto extends PartialType(GrievanceDto) {}

export class AssignGrievanceDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', description: 'ID of the employee to whom the grievance is being assigned' })
    employee_id!: string;
}
