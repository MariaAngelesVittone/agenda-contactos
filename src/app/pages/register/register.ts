import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required, validate } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { PasswordToggle } from '../../components/password-toggle/password-toggle';
import { RegisterForm } from '../../interfaces/register';
import { AuthService } from '../../services/auth-service';
import { showToast } from '../../utils/alerts';
import { requiredText } from '../../utils/validators';

@Component({
  imports: [FormField, PasswordToggle, RouterLink],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  authService = inject(AuthService);
  router = inject(Router);

  registerModel = signal<RegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
  });

  formRegister = form(this.registerModel, (path) => {
    requiredText(path.firstName, 'Name is required');
    requiredText(path.lastName, 'Last name is required');
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Enter a valid email address' });
    required(path.password, { message: 'Password is required' });
    minLength(path.password, 8, { message: 'Password must be at least 8 characters' });
    required(path.password2, { message: 'Confirm your password' });
    validate(path.password2, ({ value, valueOf }) =>
      !value() || value() === valueOf(path.password)
        ? undefined
        : { kind: 'passwordMatch', message: 'Passwords do not match' },
    );
  });

  submitting = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  showPassword2 = signal(false);

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const formState = this.formRegister();
    formState.markAsTouched();
    if (formState.invalid()) {
      formState.errorSummary()[0]?.fieldTree().focusBoundControl();
      return;
    }

    this.errorMessage.set('');
    this.submitting.set(true);
    const result = await this.authService.register(this.registerModel());
    this.submitting.set(false);

    if (result === 'success') {
      showToast('Account created successfully');
      this.router.navigate(['/login']);
    } else if (result === 'rejected') {
      this.errorMessage.set(
        'We could not create your account. Check your details or try a different email.',
      );
    } else {
      this.errorMessage.set('We could not reach the server. Please try again in a moment.');
    }
  }
}
