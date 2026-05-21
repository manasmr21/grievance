import { ApiProperty } from "@nestjs/swagger";

export class StudentDetailsDto {
    @ApiProperty({ example: 'Jane Doe', description: 'Name of the student' })
    name: string;

    @ApiProperty({ example: '2023STUD001', description: 'Unique registration number of the student' })
    registration_number: string;

    @ApiProperty({ example: 1, description: 'ID of the department' })
    department_id: number;

    @ApiProperty({ example: 1, description: 'ID of the hostel', required: false })
    hostel_id?: number;

    @ApiProperty({ example: 1, description: 'ID of the hostel room', required: false })
    hostel_room_id?: number;

    @ApiProperty({ example: 1, description: 'ID of the hostel block', required: false })
    hostel_block_id?: number;
}
