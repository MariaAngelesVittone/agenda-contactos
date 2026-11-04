import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avatar } from '../../components/avatar/avatar';
import { Contact } from '../../interfaces/contact';
import { ContactService } from '../../services/contact-service';
import { confirmDelete, showToast } from '../../utils/alerts';

@Component({
  imports: [Avatar, RouterLink],
  selector: 'app-contact-list',
  styleUrl: './contact-list.scss',
  templateUrl: './contact-list.html',
})
export class ContactList {
  readonly contactService = inject(ContactService);
  readonly contacts = this.contactService.contacts;

  async eliminateContact(contact: Contact): Promise<void> {
    if (!(await confirmDelete(`${contact.name} ${contact.lastname}`))) {
      return;
    }
    this.contactService.deleteContact(contact.id);
    showToast('Contact eliminated successfully');
  }
}
