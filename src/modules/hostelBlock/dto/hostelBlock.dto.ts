import { ApiProperty } from "@nestjs/swagger";

export class HostelBlockDto {
    @ApiProperty({ example: 'Block A', description: 'Name of the block' })
    name: string;

    @ApiProperty({ example: 1, description: 'ID of the hostel' })
    hostel_id: number;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID of the employee assigned as warden for this block', required: false })
    warden_employee_id?: string;
}
