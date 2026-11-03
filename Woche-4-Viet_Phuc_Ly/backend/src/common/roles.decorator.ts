// src/common/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import type { Role } from '../../generated/prisma/client';

export const ROLES_KEY = 'roles';

/** Markiert einen Controller/Endpunkt mit den erlaubten Rollen, z. B. @Roles('MERCHANT') */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
