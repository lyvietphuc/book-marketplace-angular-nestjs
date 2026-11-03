// src/auth/jwt-payload.ts
import type { Role } from '../../generated/prisma/client';

// Bewusst minimal: User-ID (sub) und Rolle. Keine E-Mail, kein Passwort/Hash.
// Die Rolle ist nicht geheim, sie steuert nur, welche Endpunkte erlaubt sind.
export type JwtPayload = {
  sub: number;
  role: Role;
};
