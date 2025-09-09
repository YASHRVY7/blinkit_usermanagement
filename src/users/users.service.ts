// src/users/users.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, Role } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  private async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async create(dto: CreateUserDto, creatorRoles: Role[]): Promise<User> {
    if ((dto.roles.includes(Role.ADMIN) || dto.roles.includes(Role.SUPERVISOR)) &&
        !creatorRoles.includes(Role.ADMIN)) {
      throw new BadRequestException('Only Admin can assign Admin/Supervisor roles');
    }

    const dup = await this.repo.findOne({ where: [{ email: dto.email }, { username: dto.username }] as FindOptionsWhere<User>[] });
    if (dup) throw new BadRequestException('Username or Email already exists');

    const user = this.repo.create({
      username: dto.username,
      email: dto.email,
      password: await this.hash(dto.password),
      roles: dto.roles,
      isActive: true,
    });

    return this.repo.save(user);
  }

  async findAll(skip = 0, take = 10): Promise<User[]> {
    return this.repo.find({ skip, take });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async update(id: string, dto: UpdateUserDto, updaterRoles?: Role[]): Promise<User> {
    const user = await this.findOne(id);

    if (dto.roles && dto.roles.length) {
      if (!updaterRoles?.includes(Role.ADMIN)) {
        throw new BadRequestException('Only Admin can change roles');
      }
    }

    if (dto.username || dto.email) {
      const dup = await this.repo.findOne({
        where: [
          dto.username ? { username: dto.username } : { id: 'noop' },
          dto.email ? { email: dto.email } : { id: 'noop' },
        ] as FindOptionsWhere<User>[],
      });
      if (dup && dup.id !== id) throw new BadRequestException('Username or Email already exists');
    }

    if (dto.password) {
      dto.password = await this.hash(dto.password);
    }

    Object.assign(user, dto);
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.repo.remove(user);
  }
}
