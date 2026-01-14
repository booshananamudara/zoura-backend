import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@/common/enums';

/**
 * Guard to check if the authenticated user has the required role(s).
 * The role is extracted from the JWT payload by the JwtStrategy
 * and attached to request.user.role
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user; // { id, email, role }

        // Check if user's role is in the required roles
        return requiredRoles.includes(user?.role);
    }
}
