import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Role } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AdminSeeder implements OnModuleInit {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(private readonly usersService: UsersService) {}

  async onModuleInit(): Promise<void> {
    const username = 'yashwanth';
    const email = 'yashwanth@admin.local';
    const password = 'Yash@77';

    try {
      const existingByEmail = await this.usersService.findByEmail(email);
      if (existingByEmail) {
        this.logger.log(`Admin user already exists: ${email}`);
        return;
      }

      const dto: CreateUserDto = {
        username,
        email,
        password,
        roles: [Role.ADMIN],
      };

      await this.usersService.create(dto, [Role.ADMIN]);
      this.logger.log(`Admin user created: ${email}`);
    } catch (error) {
      this.logger.error('Failed to create admin user', error?.stack || String(error));
    }
  }
}


