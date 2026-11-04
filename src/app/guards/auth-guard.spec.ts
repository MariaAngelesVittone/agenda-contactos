import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { authGuard } from './auth-guard';

describe('authGuard', () => {
  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: () => null });
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('sends visitors without a session to the login page', () => {
    expect(String(runGuard())).toBe('/login');
  });

  it('lets a logged in user through', () => {
    TestBed.inject(AuthService).token.set('the-token');

    expect(runGuard()).toBe(true);
  });
});
