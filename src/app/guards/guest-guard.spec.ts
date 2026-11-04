import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { useMemoryStorage } from '../testing/memory-storage';
import { guestGuard } from './guest-guard';

describe('guestGuard', () => {
  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    useMemoryStorage();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('lets visitors without a session through', () => {
    expect(runGuard()).toBe(true);
  });

  it('sends a logged in user to the contacts page', () => {
    TestBed.inject(AuthService).userId.set(1);

    expect(String(runGuard())).toBe('/contacts');
  });
});
