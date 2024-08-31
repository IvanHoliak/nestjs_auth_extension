import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { CoffeesModule } from 'src/coffees/coffees.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from 'src/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from 'src/iam/iam.module';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    CoffeesModule,
    UsersModule,
    IamModule,
    ApiKeysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  getListeningPort() {
    return this.configService.get('port');
  }
}
