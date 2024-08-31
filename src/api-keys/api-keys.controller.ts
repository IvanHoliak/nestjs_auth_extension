import { Controller, Post, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Auth(AuthType.Bearer)
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  create(@CurrentUser() user: ActiveUserData) {
    return this.apiKeysService.create(user.sub);
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  remove(@CurrentUser() user: ActiveUserData) {
    return this.apiKeysService.remove(user.sub);
  }
}
