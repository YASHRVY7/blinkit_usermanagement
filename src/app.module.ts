import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import { AdminSeeder } from './seeder/admin.seeder';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true, load: [databaseConfig]}
  ), 
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const db=config.get('database');
      return {
        type: 'postgres',
        host: db.host,
        port: db.port,
        username: db.username,  // Changed from user to username
        password: db.password,
        database: db.database,  // Changed from name to database
        entities: [User],
        synchronize: true,
      }
    }
  }),
  UsersModule,
  AuthModule],

  controllers: [AppController],
  providers: [AppService, AdminSeeder],
})
export class AppModule {}
