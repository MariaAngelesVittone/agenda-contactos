import { Component, inject, input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Contact } from '../../interfaces/contact';
import { ContactService } from '../../services/contact-service';

@Component({
  imports: [RouterLink],
  selector: 'app-contact-details',
  styleUrl: './contact-details.scss',
  templateUrl: './contact-details.html',
})
export class ContactDetails implements OnInit {
  id = input<string>();
  contacto: Contact | undefined;
  contactsService = inject(ContactService);
  router = inject(Router);

  ngOnInit(): void {
    const routeId = this.id();
    if (routeId) {
      this.contacto = this.contactsService.getContactById(routeId);
    }
  }

  eliminateContact(): void {
    if (this.contacto) {
      this.contactsService.deleteContact(this.contacto.id);
      this.router.navigate(['/contacts']);
    }
  }
}
