import { ApiProperty } from "@nestjs/swagger";

export class GrievanceCategoryDto {
    @ApiProperty({ example: 'Hostel Issues', description: 'The name of the category' })
    name!: string;

    @ApiProperty({ example: 'HOSTEL', description: 'The unique code of the category' })
    code!: string;
}
