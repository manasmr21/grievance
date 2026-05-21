import { ApiProperty } from "@nestjs/swagger";

export class HostelDto {
    @ApiProperty({ example: 'Hostel A', description: 'The name of the hostel' })
    name!: string;

    @ApiProperty({ example: 'HOSTEL_A', description: 'The unique code of the hostel' })
    code!: string;

    @ApiProperty({ example: 'EMP001', description: 'The employee ID of the default warden' })
    default_warden_employee_id!: string;

    @ApiProperty({ example: false, description: 'Indicates if the hostel is a special category', required: false })
    is_special?: boolean;
}
