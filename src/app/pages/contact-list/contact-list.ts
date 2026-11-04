import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avatar } from '../../components/avatar/avatar';
import { PageHeader } from '../../components/page-header/page-header';
import { Contact } from '../../interfaces/contact';
import { ContactService } from '../../services/contact-service';
import { confirmDelete, showToast } from '../../utils/alerts';

@Component({
  imports: [Avatar, PageHeader, RouterLink],
  selector: 'app-contact-list',
  styleUrl: './contact-list.scss',
  templateUrl: './contact-list.html',
})
export class ContactList {
  readonly contactService = inject(ContactService);
  readonly contacts = this.contactService.contacts;

  async eliminateContact(contact: Contact): Promise<void> {
    if (!(await confirmDelete(`${contact.firstName} ${contact.lastName}`))) {
      return;
    }
    this.contactService.deleteContact(contact.id);
    showToast('Contact eliminated successfully');
  }
}
