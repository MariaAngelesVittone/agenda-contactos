import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth-service';

const credentials = { email: 'ana@example.com', password: 'secret1234' };
const newUser = { firstName: 'Ana', lastName: 'Perez', ...credentials, password2: 'secret1234' };

describe('AuthService', () => {
  let service: AuthService;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    const items = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => items.get(key) ?? null,
      setItem: (key: string, value: string) => items.set(key, value),
      removeItem: (key: string) => items.delete(key),
      clear: () => items.clear(),
    });
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(AuthService);
  });

  it('logs in and keeps the token the server returns', async () => {
    fetchMock.mockResolvedValueOnce(new Response('the-token', { status: 200 }));

    expect(await service.login(credentials)).toBe('success');
    expect(service.isLoggedIn()).toBe(true);
    expect(service.token()).toBe('the-token');
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/authentication\/authenticate$/);
    expect(JSON.parse(init.body)).toEqual(credentials);
  });

  it('rejects wrong credentials', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }));

    expect(await service.login(credentials)).toBe('rejected');
    expect(service.isLoggedIn()).toBe(false);
  });

  it('reports when the server cannot be reached', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    expect(await service.login(credentials)).toBe('unavailable');
    expect(service.isLoggedIn()).toBe(false);
  });

  it('registers a user without sending the password confirmation', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 201 }));

    expect(await service.register(newUser)).toBe('success');
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/users$/);
    expect(JSON.parse(init.body)).toEqual({ firstName: 'Ana', lastName: 'Perez', ...credentials });
  });

  it('reports when the server refuses the registration', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 400 }));

    expect(await service.register(newUser)).toBe('rejected');
  });

  it('keeps the session after a reload', async () => {
    fetchMock.mockResolvedValueOnce(new Response('the-token', { status: 200 }));
    await service.login(credentials);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });

    expect(TestBed.inject(AuthService).isLoggedIn()).toBe(true);
  });

  it('logs out, forgets the token and goes to the login page', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fetchMock.mockResolvedValueOnce(new Response('the-token', { status: 200 }));
    await service.login(credentials);

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
