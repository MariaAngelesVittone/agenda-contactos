import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth-service';
import { PageHeader } from './page-header';

describe('PageHeader', () => {
  let component: PageHeader;

  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: () => null });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    });
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    TestBed.configureTestingModule({ imports: [PageHeader], providers: [provideRouter([])] });
    component = TestBed.createComponent(PageHeader).componentInstance;
  });

  afterEach(() => Swal.close());

  it('asks for confirmation and stays logged in when the user cancels', async () => {
    const logout = vi.spyOn(TestBed.inject(AuthService), 'logout').mockImplementation(() => {});

    const result = component.logout();
    expect(document.querySelector('.swal2-title')?.textContent).toBe('Log out?');
    document.querySelector<HTMLButtonElement>('.swal2-cancel')?.click();
    await result;

    expect(logout).not.toHaveBeenCalled();
  });

  it('logs out when the user confirms', async () => {
    const logout = vi.spyOn(TestBed.inject(AuthService), 'logout').mockImplementation(() => {});

    const result = component.logout();
    document.querySelector<HTMLButtonElement>('.swal2-confirm')?.click();
    await result;

    expect(logout).toHaveBeenCalledOnce();
  });
});
