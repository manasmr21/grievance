import { ApiProperty } from "@nestjs/swagger";

export class HostelRoomDto {
    @ApiProperty({ example: 1, description: 'The ID of the hostel' })
    hostel_id!: number;

    @ApiProperty({ example: '101', description: 'The room number' })
    room_number!: string;

    @ApiProperty({ example: 1, description: 'The ID of the hostel block', required: false })
    hostel_block_id?: number;
}
