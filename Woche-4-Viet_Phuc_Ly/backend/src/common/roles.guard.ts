// src/common/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Role } from '../../generated/prisma/client';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { ROLES_KEY } from './roles.decorator';

/**
 * Prüft die Rolle aus dem JWT. Muss NACH dem AuthGuard laufen:
 *   @UseGuards(AuthGuard, RolesGuard)
 * 401 = nicht eingeloggt (AuthGuard), 403 = eingeloggt, aber falsche Rolle (RolesGuard)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required || required.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!user || !required.includes(user.role)) {
      throw new ForbiddenException(
        'Für diese Funktion fehlt Ihnen die Berechtigung.',
      );
    }
    return true;
  }
}
