// src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload';
import type { Role } from '../../generated/prisma/client';

const SALT_ROUNDS = 10;

// Öffentliche User-Daten: passwordHash wird NIE nach außen gegeben
export type PublicUser = {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<PublicUser> {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException(
        'Diese E-Mail-Adresse ist bereits registriert.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    try {
      const user = await this.usersService.create({
        email,
        passwordHash,
        name: dto.name,
        role: dto.role ?? 'CUSTOMER',
      });
      return this.toPublicUser(user);
    } catch (err: unknown) {
      // P2002 = Unique-Constraint verletzt (z. B. zwei gleichzeitige Registrierungen)
      if ((err as { code?: string })?.code === 'P2002') {
        throw new ConflictException(
          'Diese E-Mail-Adresse ist bereits registriert.',
        );
      }
      throw err;
    }
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; user: PublicUser }> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(email);

    // Gleiche Fehlermeldung für "User existiert nicht" und "Passwort falsch",
    // damit man nicht herausfinden kann, welche E-Mails registriert sind.
    const passwordOk =
      user !== null && (await bcrypt.compare(dto.password, user.passwordHash));
    if (!user || !passwordOk) {
      throw new UnauthorizedException('E-Mail oder Passwort ist falsch.');
    }

    const payload: JwtPayload = { sub: user.id, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user: this.toPublicUser(user) };
  }

  async me(userId: number): Promise<PublicUser> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      // Token gültig, aber User wurde inzwischen gelöscht
      throw new UnauthorizedException('Benutzer existiert nicht mehr.');
    }
    return this.toPublicUser(user);
  }

  toPublicUser(user: PublicUser & { passwordHash?: string }): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
