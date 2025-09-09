import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private jwtService: JwtService) { }

    async register(dto: CreateUserDto): Promise<User> {
        dto.roles = [Role.USER];
        return this.usersService.create(dto, [Role.ADMIN])
    }

    async validateUser(email: string, pass: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(pass, user.password);
        if (!ok) throw new UnauthorizedException('Invalid credentials');
        return user;
    }
    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        const payload = { sub: user.id, username: user.username, roles: user.roles };
        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, {
            secret: process.env.REFRESH_JWT_SECRET || 'refreshsecret123',
            expiresIn: '7d',
        });
        return { access_token, refresh_token };
    }
    
    async refreshToken(user:{userId:string,username:string,roles:Role[]}){
        const payload = { sub: user.userId, username: user.username, roles: user.roles };
        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, {
            secret: process.env.REFRESH_JWT_SECRET || 'refreshsecret123',
            expiresIn: '7d',
        });
        return { access_token, refresh_token };
    }
    
    
}
