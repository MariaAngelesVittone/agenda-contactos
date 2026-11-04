import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { confirmLogout } from '../../utils/alerts';

@Component({
  imports: [RouterLink],
  selector: 'app-page-header',
  templateUrl: './page-header.html',
})
export class PageHeader {
  authService = inject(AuthService);

  title = input<string>();
  backLink = input<string>();

  async logout(): Promise<void> {
    if (await confirmLogout()) {
      this.authService.logout();
    }
  }
}
