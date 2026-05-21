import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserAccount } from "./models/user.model";
import { LoginDto, UpdateUserAccountDto, UserDto } from "./dto/user.dto";
import bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { handleServiceError } from "src/utils/Error/errorHandler";


interface AuthRequest extends Request{
    user?:{
        id: string,
        email: string,
        role_id: number,
        account_status: string
    }
}

@Injectable()
export class UserAccountService {
    constructor(
        @InjectModel(UserAccount)
        private userAccountModel: typeof UserAccount,
        private jwtService: JwtService,
    ) { }

    async findAll() {
        try {

            const users = await this.userAccountModel.findAll();

            return {
                success: true,
                message: "Users fetched successfully",
                data: users
            }

        } catch (error) {
            return handleServiceError(error);
        }
    }

    async register(dto: UserDto) {
        try {
            const { email, password, role_id } = dto;
            const userExist = await this.userAccountModel.findOne({ where: { email } });
            if (userExist) {
                throw new HttpException('User already exists', 400);
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.userAccountModel.create({
                email,
                password: hashedPassword,
                role_id,
                account_status: "active"
            });
            return user;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async login(dto: LoginDto) {
        try {
            const { email, password } = dto;
            const user = await this.userAccountModel.findOne({ where: { email } });
            if (!user) {
                throw new HttpException('User not found', 404);
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new HttpException('Invalid password', 401);
            }

            const payload = {
                id: user.id,
                role_id: user.role_id
            }

            const token = this.jwtService.sign(payload);

            return {
                success: true,
                message: "User login successfully",
                token,
                user
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async verify(req: AuthRequest)  {
        try {

            const userId = req.user?.id;

            if (!userId) {
                throw new HttpException('Unauthorized', 401);
            }
            const user = await this.userAccountModel.findOne({ where: { id: userId } });
            if (!user) {
                throw new HttpException('User not found', 404);
            }
            return {
                success: true,
                message: "Valid user",
                data: user
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async update(id: string, dto: UpdateUserAccountDto) {
        try {
            const user = await this.userAccountModel.findByPk(id);
            if (!user) {
                throw new HttpException('User not found', 404);
            }

            if (dto.password) {
                dto.password = await bcrypt.hash(dto.password, 10);
            }

            await user.update(dto);
            return {
                success: true,
                message: "User updated successfully",
                data: user
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    async delete(id: string) {
        try {
            const user = await this.userAccountModel.findByPk(id);
            if (!user) {
                throw new HttpException('User not found', 404);
            }
            await user.destroy();
            return {
                success: true,
                message: "User deleted successfully",
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }
}