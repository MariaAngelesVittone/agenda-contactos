import { Component, inject, OnInit, signal } from '@angular/core';
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
export class ContactList implements OnInit {
  readonly contactService = inject(ContactService);
  readonly contacts = this.contactService.contacts;

  readonly loading = signal(true);
  readonly loadFailed = signal(false);

  async ngOnInit(): Promise<void> {
    this.loadFailed.set(!(await this.contactService.loadContacts()));
    this.loading.set(false);
  }

  async eliminateContact(contact: Contact): Promise<void> {
    if (!(await confirmDelete(`${contact.firstName} ${contact.lastName}`))) {
      return;
    }
    if (await this.contactService.deleteContact(contact.id)) {
      showToast('Contact eliminated successfully');
    } else {
      showToast('The contact could not be deleted', 'error');
    }
  }
}
