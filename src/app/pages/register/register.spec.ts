import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RegisterForm } from '../../interfaces/register';
import { useMemoryStorage } from '../../testing/memory-storage';
import { Register } from './register';

describe('Register', () => {
  let component: Register;

  beforeEach(() => {
    useMemoryStorage();
    TestBed.configureTestingModule({ imports: [Register], providers: [provideRouter([])] });
    component = TestBed.createComponent(Register).componentInstance;
  });

  const fillIn = (changes: Partial<RegisterForm>) =>
    component.registerModel.update((model) => ({ ...model, ...changes }));

  const messages = (field: keyof RegisterForm) =>
    component.formRegister[field]()
      .errors()
      .map((error) => error.message);

  const validForm: RegisterForm = {
    firstName: 'Ana',
    lastName: 'Perez',
    email: 'ana@example.com',
    password: 'secret1234',
    password2: 'secret1234',
  };

  it('asks for every field', () => {
    expect(messages('firstName')).toEqual(['Name is required']);
    expect(messages('lastName')).toEqual(['Last name is required']);
    expect(messages('email')).toEqual(['Email is required']);
    expect(messages('password')).toEqual(['Password is required']);
    expect(messages('password2')).toEqual(['Confirm your password']);
  });

  it('rejects an invalid email', () => {
    fillIn({ email: 'not-an-email' });

    expect(messages('email')).toEqual(['Enter a valid email address']);
  });

  it('asks for at least 8 characters in the password', () => {
    fillIn({ password: 'short' });

    expect(messages('password')).toEqual(['Password must be at least 8 characters']);
  });

  it('checks that both passwords match', () => {
    fillIn({ password: 'secret1234', password2: 'different123' });
    expect(messages('password2')).toEqual(['Passwords do not match']);

    fillIn({ password2: 'secret1234' });
    expect(messages('password2')).toEqual([]);
  });

  it('accepts a complete and valid form', () => {
    fillIn(validForm);

    expect(component.formRegister().valid()).toBe(true);
  });
});
