import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-password-toggle',
  styleUrl: './password-toggle.scss',
  templateUrl: './password-toggle.html',
})
export class PasswordToggle {
  visible = model(false);
  controls = input<string>();
}
