import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../../users/entities/user.entity";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector){}

    canActivate(context:ExecutionContext):Promise<boolean>|boolean{
        const requiredRoles=this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass()
        ])

        if(!requiredRoles){
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if(!user){
            throw new ForbiddenException('user not authenticated');
        }
        const userRoles: Role[] = Array.isArray(user.roles) ? user.roles : [];
        const allowed = userRoles.some((r: Role) => requiredRoles.includes(r));
        if(!allowed){
            throw new ForbiddenException('user not authorized');
        }
        return true;
    }
}