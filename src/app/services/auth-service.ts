import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginForm } from '../interfaces/login';
import { RegisterForm } from '../interfaces/register';
import { User } from '../interfaces/user';
import { readStorage, writeStorage } from '../utils/storage';

async function hashPassword(email: string, password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${email}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private users = readStorage<User[]>('users', []);

  readonly userId = signal<number | null>(this.restoreSession());
  readonly isLoggedIn = computed(() => this.userId() !== null);

  async register(data: RegisterForm): Promise<boolean> {
    const email = data.email.trim().toLowerCase();
    const passwordHash = await hashPassword(email, data.password);
    if (this.users.some((user) => user.email === email)) {
      return false;
    }
    const user: User = {
      id: Math.max(0, ...this.users.map((current) => current.id)) + 1,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email,
      passwordHash,
    };
    this.users = [...this.users, user];
    writeStorage('users', this.users);
    return true;
  }

  async login(credentials: LoginForm): Promise<boolean> {
    const email = credentials.email.trim().toLowerCase();
    const passwordHash = await hashPassword(email, credentials.password);
    const user = this.users.find((current) => current.email === email);
    if (!user || user.passwordHash !== passwordHash) {
      return false;
    }
    this.saveSession(user.id);
    return true;
  }

  logout(): void {
    this.saveSession(null);
    this.router.navigate(['/login']);
  }

  private restoreSession(): number | null {
    const id = readStorage<number | null>('session', null);
    return this.users.some((user) => user.id === id) ? id : null;
  }

  private saveSession(userId: number | null): void {
    this.userId.set(userId);
    writeStorage('session', userId);
  }
}
