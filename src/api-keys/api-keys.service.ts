import { Injectable } from '@nestjs/common';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { randomUUID } from 'crypto';
import { GeneratedApiKeyPayload } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiKey } from './entities/api-key.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApiKeysService {
  constructor(
    private readonly hashingService: HashingService,
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  async create(userId: string) {
    const uuid = randomUUID();

    const { apiKey, hashedKey } = await this.createAndHash(uuid);

    await this.apiKeyRepository.save({
      uuid,
      key: hashedKey,
      user: { id: userId },
    });

    return { apiKey };
  }

  remove(userId: string) {
    return this.apiKeyRepository.delete({ user: { id: userId } });
  }

  async createAndHash(id: string): Promise<GeneratedApiKeyPayload> {
    const apiKey = this.generateApiKey(id);
    const hashedKey = await this.hashingService.hash(apiKey);

    return { apiKey, hashedKey };
  }

  async validate(apiKey: string, hashedKey: string): Promise<boolean> {
    return this.hashingService.compare(apiKey, hashedKey);
  }

  extractIdFromApiKey(apiKey: string): string {
    const [id] = Buffer.from(apiKey, 'base64').toString('ascii').split(' ');

    return id;
  }

  private generateApiKey(id: string): string {
    const apiKey = `${id} ${randomUUID()}`;

    return Buffer.from(apiKey).toString('base64');
  }
}
