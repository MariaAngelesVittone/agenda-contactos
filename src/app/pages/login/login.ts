import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { PasswordToggle } from '../../components/password-toggle/password-toggle';
import { LoginForm } from '../../interfaces/login';
import { AuthService } from '../../services/auth-service';

@Component({
  imports: [FormField, PasswordToggle, RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);

  loginModel = signal<LoginForm>({
    email: '',
    password: '',
  });

  formLogin = form(this.loginModel, (path) => {
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Enter a valid email address' });
    required(path.password, { message: 'Password is required' });
    minLength(path.password, 8, { message: 'Password must be at least 8 characters' });
  });

  submitting = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const formState = this.formLogin();
    formState.markAsTouched();
    if (formState.invalid()) {
      formState.errorSummary()[0]?.fieldTree().focusBoundControl();
      return;
    }

    this.errorMessage.set('');
    this.submitting.set(true);
    const result = await this.authService.login(this.loginModel());
    this.submitting.set(false);

    if (result === 'success') {
      this.router.navigate(['/contacts']);
    } else if (result === 'rejected') {
      this.errorMessage.set('Incorrect email or password.');
    } else {
      this.errorMessage.set('We could not reach the server. Please try again in a moment.');
    }
  }
}
