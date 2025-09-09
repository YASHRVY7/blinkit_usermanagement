import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt_strategy/jwt.strategy';
import { RefreshJwtStrategy } from './jwt_strategy/refresh-jwt.strategy';
@Module({
  imports:[
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret123',
      signOptions:{expiresIn:'15m'}
    }),
    JwtModule.register({
      secret: process.env.REFRESH_JWT_SECRET || 'refreshsecret123',
      signOptions:{expiresIn:'7d'}

    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers:[
    AuthService,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  exports:[
    AuthService
  ]
})
export class AuthModule {}
