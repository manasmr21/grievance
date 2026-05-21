import { Controller, Post, Get, Put, Delete, Body, Req, Param, UseGuards } from "@nestjs/common";
import { UserAccountService } from "./userAccount.service";
import { LoginDto, UserDto, UpdateUserAccountDto } from "./dto/user.dto";
import { AuthGuard } from "../../auth/jwt.guard";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('User Accounts')
@Controller('user-account')
export class UserAccountController {
    constructor(private readonly userAccountService: UserAccountService) { }

    @Get()
    getAllUsers() {
        return this.userAccountService.findAll();
    }

    @Post('register')
    registerUser(@Body() dto: UserDto) {
        return this.userAccountService.register(dto);
    }

    @Post('login')
    loginUser(@Body() dto: LoginDto) {
        return this.userAccountService.login(dto);
    }

    @Get('verify')
    @UseGuards(AuthGuard)
    verifyUser(@Req() req: any) {
        return this.userAccountService.verify(req);
    }

    @Put('update/:id')
    updateUser(@Param('id') id: string, @Body() dto: UpdateUserAccountDto) {
        return this.userAccountService.update(id, dto);
    }

    @Delete('delete/:id')
    deleteUser(@Param('id') id: string) {
        return this.userAccountService.delete(id);
    }
}
