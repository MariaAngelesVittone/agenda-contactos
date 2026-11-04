import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { useMemoryStorage } from '../testing/memory-storage';
import { authGuard } from './auth-guard';

describe('authGuard', () => {
  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    useMemoryStorage();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('sends visitors without a session to the login page', () => {
    expect(String(runGuard())).toBe('/login');
  });

  it('lets a logged in user through', () => {
    TestBed.inject(AuthService).userId.set(1);

    expect(runGuard()).toBe(true);
  });
});
