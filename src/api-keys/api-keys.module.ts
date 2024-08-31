import { Module } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { ApiKeysController } from './api-keys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ApiKey } from './entities/api-key.entity';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { BcryptService } from 'src/iam/hashing/bcrypt.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, ApiKey])],
  controllers: [ApiKeysController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    ApiKeysService,
    JwtService,
  ],
})
export class ApiKeysModule {}
