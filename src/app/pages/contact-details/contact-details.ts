import { Component, inject, input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Avatar } from '../../components/avatar/avatar';
import { Contact } from '../../interfaces/contact';
import { ContactService } from '../../services/contact-service';
import { confirmDelete, showToast } from '../../utils/alerts';

@Component({
  imports: [Avatar, RouterLink],
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

  async eliminateContact(): Promise<void> {
    if (!this.contacto) {
      return;
    }
    const { id, name, lastname } = this.contacto;
    if (!(await confirmDelete(`${name} ${lastname}`))) {
      return;
    }
    this.contactsService.deleteContact(id);
    showToast('Contact eliminated successfully');
    this.router.navigate(['/contacts']);
  }
}
