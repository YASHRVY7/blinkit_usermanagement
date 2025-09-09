import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Role } from "../../users/entities/user.entity"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            secretOrKey: process.env.JWT_SECRET || 'secret123',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
        })
    }

    async validate(payload: { sub: string; username: string; roles: Role[] }) {
        // attaches to req.user
        return { userId: payload.sub, username: payload.username, roles: payload.roles };
    }
}