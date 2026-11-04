import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginForm } from '../interfaces/login';
import { RegisterForm } from '../interfaces/register';
import { apiFetch } from '../utils/api';
import { readStorage, writeStorage } from '../utils/storage';

export type AuthResult = 'success' | 'rejected' | 'unavailable';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  readonly token = signal(readStorage('token', ''));
  readonly isLoggedIn = computed(() => this.token() !== '');

  async login(credentials: LoginForm): Promise<AuthResult> {
    const res = await apiFetch('/authentication/authenticate', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      return this.failure(res);
    }
    this.saveToken(await res.text());
    return 'success';
  }

  async register(data: RegisterForm): Promise<AuthResult> {
    const { firstName, lastName, email, password } = data;
    const res = await apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    return res.ok ? 'success' : this.failure(res);
  }

  logout(): void {
    this.saveToken('');
    this.router.navigate(['/login']);
  }

  private failure(res: Response): AuthResult {
    return res.status === 0 ? 'unavailable' : 'rejected';
  }

  private saveToken(token: string): void {
    this.token.set(token);
    writeStorage('token', token);
  }
}
