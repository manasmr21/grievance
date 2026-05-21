import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserAccountService } from './userAccount.service';
import { UserAccountController } from './userAccount.controller';
import { UserAccount } from './models/user.model';
import { JwtAuthModule } from '../../auth/jwt.module';

@Module({
  imports: [
    SequelizeModule.forFeature([UserAccount]),
    JwtAuthModule,
  ],
  providers: [UserAccountService],
  controllers: [UserAccountController],
  exports: [UserAccountService],
})
export class UserAccountModule {}
