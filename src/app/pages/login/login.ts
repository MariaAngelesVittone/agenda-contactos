import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { PasswordToggle } from '../../components/password-toggle/password-toggle';
import { LoginForm } from '../../interfaces/login';
import { AuthService } from '../../services/auth-service';

@Component({
  imports: [FormField, PasswordToggle, RouterLink],
  selector: 'app-login',
  styleUrl: './login.scss',
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
  });

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
    if (await this.authService.login(this.loginModel())) {
      this.router.navigate(['/contacts']);
    } else {
      this.errorMessage.set('Incorrect email or password.');
    }
  }
}
