import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
    constructor() {
        super({
            secretOrKey: process.env.REFRESH_JWT_SECRET || 'refreshsecret123',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
        })
    }
    // payload includes sub (userId)
    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username, roles: payload.roles };
    }

} 