import { ApiProperty, PartialType } from "@nestjs/swagger";

export class EmployeeDetailsDto {
    @ApiProperty({ example: 'John Doe', description: 'Name of the employee' })
    name: string;

    @ApiProperty({ example: 1, description: 'ID of the role' })
    role_id: number;

    @ApiProperty({ example: 1, description: 'ID of the department', required: false })
    department_id?: number;

    @ApiProperty({ example: 1, description: 'ID of the hostel', required: false })
    hostel_id?: number;

    @ApiProperty({ example: 1, description: 'ID of the hostel block', required: false })
    hostel_block_id?: number;
}

export class UpdateEmployeeDetailsDto extends PartialType(EmployeeDetailsDto) {}
