import { ApiProperty } from "@nestjs/swagger";

export class DepartmentDto {
    @ApiProperty({ example: 'Maintenance', description: 'The name of the department' })
    name!: string;

    @ApiProperty({ example: 'MAIN', description: 'The unique code of the department' })
    code!: string;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'The employee ID of the default HOD', required: false })
    default_hod_employee_id?: string;
}
