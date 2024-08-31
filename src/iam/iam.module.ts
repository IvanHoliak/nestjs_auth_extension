import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { AccessTokenGuard } from './authentication/guards/access-token/access-token.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids/refresh-token-ids.storage';
import { RolesGuard } from './authorization/guards/roles/roles.guard';
import { PermissionsGuard } from './authorization/guards/permission/permission.guard';
import { ApiKey } from 'src/api-keys/entities/api-key.entity';
import { ApiKeyGuard } from 'src/api-keys/guards/api-key.guard';
import { ApiKeysService } from 'src/api-keys/api-keys.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiKey]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },

    /**
     * Нет смысла использовать RolesGuard и PermissionsGuard вместе, так как они оба проверяют права доступа.
     * Можно использовать RolesGuard и для базовых ролей выдавать права тип role:
     * ADMIN имеет права [READ, DELETE, CREATE, UPDATE];
     * REGULAR имеет права [READ, CREATE];
     * ...
     *
     * Так же же для определенного юзера мы можем выдать права на конкретные действия, например:
     * ADMIN имеет права [READ, DELETE, CREATE, UPDATE, CREATE_COFFEE, DELETE_COFFEE];
     * REGULAR имеет права [READ, CREATE, CREATE_COFFEE];
     * ...
     *
     * Таким образом мы можем использовать RolesGuard для проверки ролей и прав доступа.
     * Как по мне это более гибкое решение, так как мы можем выдавать права на конкретные действия для конкретных ролей.
     */
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard, //RolesGuard,
    },
    AccessTokenGuard,
    ApiKeyGuard,
    RefreshTokenIdsStorage,
    AuthenticationService,
    ApiKeysService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
