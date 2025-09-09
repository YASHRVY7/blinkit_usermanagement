import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  SUPERVISOR = 'supervisor',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true })
  username: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // hashed

  @Column('simple-array')
  roles: Role[]; // stored as comma-separated strings [7][10]

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  currentHashedRefreshToken: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  refreshTokenExpiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
