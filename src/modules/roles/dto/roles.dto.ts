import { ApiProperty } from "@nestjs/swagger";

export class RoleDto {
    @ApiProperty({ example: 'Admin', description: 'The name of the role' })
    name!: string;

    @ApiProperty({ example: 'ADMIN', description: 'The unique code of the role' })
    code!: string;
}