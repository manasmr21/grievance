import { ApiProperty } from "@nestjs/swagger";

export class TicketPriorityDto {
    @ApiProperty({ example: 'High', description: 'The name of the priority' })
    name!: string;

    @ApiProperty({ example: 'HIGH', description: 'The unique code of the priority' })
    code!: string;
}
