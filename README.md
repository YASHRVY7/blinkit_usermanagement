<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" alt="NestJS" height="70" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/typeorm/typeorm/master/resources/logo_big.png" alt="TypeORM" height="70" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://www.postgresql.org/media/img/about/press/elephant.png" alt="PostgreSQL" height="70" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/JWT-Auth-000000.svg?logo=jsonwebtokens&logoColor=white" alt="JWT" height="70" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://avatars.githubusercontent.com/u/3006190?s=200&v=4" alt="Passport" height="70" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png" alt="TypeScript" height="70" />
</p>

<h2 align="center">Blinkit User Management</h2>
<p align="center">Role-based user management with NestJS, TypeORM, PostgreSQL, and JWT (access + refresh) authentication.</p>

<p align="center">
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node-18%2B-339933?logo=node.js&logoColor=white" alt="Node 18+" />
  </a>
  <a href="https://nestjs.com/">
    <img src="https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white" alt="NestJS 11" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5" />
  </a>
  <a href="https://typeorm.io/">
    <img src="https://img.shields.io/badge/TypeORM-0.3.x-FF3E00?logo=databricks&logoColor=white" alt="TypeORM" />
  </a>
  <a href="https://www.postgresql.org/">
    <img src="https://img.shields.io/badge/PostgreSQL-13%2B-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </a>
  <a href="https://jwt.io/">
    <img src="https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white" alt="JWT" />
  </a>
  <a href="http://www.passportjs.org/">
    <img src="https://img.shields.io/badge/Passport-JS-34E27A?logo=passport&logoColor=white" alt="Passport" />
  </a>
</p>

<hr/>

### Features

- Register and login with email/password (bcrypt hashed)
- Stateless JWT authentication with access token (15m) and refresh token (7d)
- Role-based authorization (Admin, Supervisor, User) via guards/decorators
- Users CRUD (Admin/limited Supervisor)
- Auto-admin seeder on app startup (creates an Admin if not present)
- Centralized config via environment variables

---

## Folder Structure

```text

├─ src/
│  ├─ app.module.ts
│  ├─ app.controller.ts
│  ├─ app.service.ts
│  ├─ config/
│  │  ├─ database.config.ts
│  │  └─ jwt.config.ts (not used directly; JWT is configured in AuthModule)
│  ├─ auth/
│  │  ├─ auth.constants.ts
│  │  ├─ auth.controller.ts
│  │  ├─ auth.module.ts
│  │  ├─ auth.service.ts
│  │  ├─ decorators/
│  │  │  └─ roles.decorator.ts
│  │  ├─ guards/
│  │  │  ├─ jwt-auth.guard.ts
│  │  │  ├─ refresh-jwt.guard.ts
│  │  │  └─ roles.guard.ts
│  │  └─ jwt_strategy/
│  │     ├─ jwt.strategy.ts
│  │     └─ refresh-jwt.strategy.ts
│  ├─ users/
│  │  ├─ dto/
│  │  │  ├─ create-user.dto.ts
│  │  │  └─ update-user.dto.ts
│  │  ├─ entities/
│  │  │  └─ user.entity.ts
│  │  ├─ users.controller.ts
│  │  ├─ users.module.ts
│  │  └─ users.service.ts
│  └─ seeder/
│     └─ admin.seeder.ts
├─ dist/ (build output)
├─ package.json
├─ tsconfig.json
├─ tsconfig.build.json
└─ eslint.config.mjs
```

---

## Environment Variables

Create a `.env` file at project root:

```env
# Postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=blinkit_user

# JWT
JWT_SECRET=secret123
REFRESH_JWT_SECRET=refreshsecret123

# Optional: override ports or other app configs if needed
```

Notes:
- DB config is read via `src/config/database.config.ts`.
- JWT access secret is configured in `AuthModule` via `JwtModule.register({ secret, expiresIn: '15m' })`.
- Refresh secret is used only when signing/validating refresh tokens in the refresh strategy/service.
- TypeORM `synchronize: true` is enabled for local/dev (auto sync schema). Disable for prod and use migrations.

---

## Database Schema

Using TypeORM `synchronize: true`, the `users` table is derived from `src/users/entities/user.entity.ts`.

```ts
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
  password: string; // hashed with bcrypt

  @Column('simple-array')
  roles: Role[]; // e.g. "admin,user"

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  currentHashedRefreshToken: string | null; // reserved for stateful refresh if needed

  @Column({ type: 'timestamptz', nullable: true })
  refreshTokenExpiresAt: Date | null; // reserved for stateful refresh if needed

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

Enum `Role`:
- `admin`
- `user`
- `supervisor`

---

## Installation & Running

```bash
# 1) Install dependencies
npm install

# 2) Prepare environment
# Create .env with DB + JWT secrets as shown above.
# Ensure PostgreSQL is running and DATABASE_NAME exists (or create it).

# 3) Start the app (dev)
npm run start:dev
# or production build
npm run build && npm run start:prod
```

App will start on `http://localhost:3000`.

---

## Seeding Admin

An admin is created automatically at startup if it doesn’t exist. See `src/seeder/admin.seeder.ts`.

Defaults:
- username: ``
- email: ``
- password: ``
- roles: `[admin]`

To change defaults, edit `src/seeder/admin.seeder.ts`:
- `username`, `email`, `password` literals.

The seeder checks by email; if found, it logs and skips.

---

## Authentication

### Tokens
- Access token: signed with `JWT_SECRET`, expires in 15 minutes (configured in `AuthModule`).
- Refresh token: signed with `REFRESH_JWT_SECRET`, expires in 7 days (signed in `AuthService`).
- Strategies:
  - Access: `JwtStrategy` (`Authorization: Bearer <access_token>`)
  - Refresh: `RefreshJwtStrategy` (`Authorization: Bearer <refresh_token>`)

Ensure both sign and verify use the same secrets. In code, refresh tokens are signed with:
- `process.env.REFRESH_JWT_SECRET || 'refreshsecret123'`

And verified with the same in `refresh-jwt.strategy.ts`.

---

## API Overview

Base URL: `http://localhost:3000`

### Auth

- POST `/auth/register`
  - Body:
    ```json
    {
      "username": "jdoe",
      "email": "jdoe@example.com",
      "password": "Str0ng@Pass!",
      "roles": ["user"]
    }
    ```
  - Returns created `User` entity (including hashed `password`).

- POST `/auth/login`
  - Body:
    ```json
    {
      "email": "jdoe@example.com",
      "password": "Str0ng@Pass!"
    }
    ```
  - Returns:
    ```json
    {
      "access_token": "<jwt>",
      "refresh_token": "<jwt>"
    }
    ```

- POST `/auth/refresh`
  - Headers:
    - `Authorization: Bearer <refresh_token>`
  - Returns:
    ```json
    {
      "access_token": "<new_access_jwt>",
      "refresh_token": "<new_refresh_jwt>"
    }
    ```

Common 401 causes for refresh:
- Using the access token instead of refresh token
- Mismatched `REFRESH_JWT_SECRET` between signing and strategy verification
- Expired refresh token

### Users (Protected, Role-based)

All endpoints under `/users` require `Authorization: Bearer <access_token>`. Role checks via `@Roles(...)` and `RolesGuard`.

- POST `/users` (Roles: Admin, Supervisor can create; Admin check is enforced inside service if role escalation attempted)
  - Body:
    ```json
    {
      "username": "alice",
      "email": "alice@example.com",
      "password": "Str0ng@Pass!",
      "roles": ["user"]
    }
    ```
  - Returns created user.

- GET `/users` (Roles: Admin)
  - Query: `skip`, `take` (optional)
  - Returns list of users.

- GET `/users/:id` (Roles: Admin, Supervisor)
  - Returns user by id.

- PUT `/users/:id` (Roles: Admin)
  - Body: Partial `UpdateUserDto` (any of `username`, `email`, `password`, `roles`)
  - Returns updated user.

- DELETE `/users/:id` (Roles: Admin)
  - Deletes user.

Validation/Rules:
- Passwords are validated for strength in `CreateUserDto`.
- Admin-only rule for assigning `admin`/`supervisor` roles is enforced in `UsersService.create(...)`.
- Duplicate email/username checks included.

---


## Testing

```bash
npm run test
npm run test:e2e
```

---

## Troubleshooting

- 401 on `/auth/refresh`:
  - Ensure you pass the refresh token, not the access token.
  - Ensure `REFRESH_JWT_SECRET` is consistent across signing and strategy.
  - Check expiration (defaults to 7 days).
- Role errors when creating/updating users:
  - Only Admin may assign `admin`/`supervisor` or update roles.
- DB connection issues:
  - Verify `.env` matches Postgres instance and database exists.

---
