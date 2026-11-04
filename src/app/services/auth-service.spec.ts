import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { useMemoryStorage } from '../testing/memory-storage';
import { AuthService } from './auth-service';

const newUser = {
  firstName: 'Ana',
  lastName: 'Perez',
  email: 'ana@example.com',
  password: 'secret1234',
  password2: 'secret1234',
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    useMemoryStorage();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(AuthService);
  });

  it('registers a user without storing the password in plain text', async () => {
    expect(await service.register(newUser)).toBe(true);
    expect(localStorage.getItem('agenda:users')).not.toContain(newUser.password);
  });

  it('rejects an email that is already registered, ignoring case', async () => {
    await service.register(newUser);
    expect(await service.register({ ...newUser, email: 'ANA@example.com' })).toBe(false);
  });

  it('logs in with the right credentials', async () => {
    await service.register(newUser);
    expect(await service.login({ email: 'Ana@Example.com', password: 'secret1234' })).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
  });

  it('rejects a wrong password or an unknown email', async () => {
    await service.register(newUser);
    expect(await service.login({ email: newUser.email, password: 'wrong-pass1' })).toBe(false);
    expect(await service.login({ email: 'nobody@example.com', password: 'secret1234' })).toBe(
      false,
    );
    expect(service.isLoggedIn()).toBe(false);
  });

  it('keeps the session after a reload', async () => {
    await service.register(newUser);
    await service.login({ email: newUser.email, password: newUser.password });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });

    expect(TestBed.inject(AuthService).isLoggedIn()).toBe(true);
  });

  it('logs out, clears the session and goes to the login page', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await service.register(newUser);
    await service.login({ email: newUser.email, password: newUser.password });

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
