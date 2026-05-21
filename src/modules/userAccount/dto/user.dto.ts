import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
    email!: string;

    @ApiProperty({ example: 'Password@123', description: 'The password of the user' })
    password!: string;

    @ApiProperty({ example: '1', description: 'The id of the role of the user' })
    role_id!: number;
}

export class LoginDto {
    @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
    email!: string;

    @ApiProperty({ example: 'Password@123', description: 'The password of the user' })
    password!: string;
}

export class UpdateUserAccountDto {
    @ApiProperty({ example: 'user@example.com', description: 'The email of the user', required: false })
    email?: string;

    @ApiProperty({ example: 'NewPassword@123', description: 'The new password of the user', required: false })
    password?: string;

    @ApiProperty({ example: 1, description: 'The role id of the user', required: false })
    role_id?: number;

    @ApiProperty({ example: 'ACTIVE', description: 'The account status', required: false })
    account_status?: string;
}