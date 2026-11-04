import { Component, inject, input, numberAttribute, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Avatar } from '../../components/avatar/avatar';
import { PageHeader } from '../../components/page-header/page-header';
import { Contact } from '../../interfaces/contact';
import { ContactService } from '../../services/contact-service';
import { confirmDelete, showToast } from '../../utils/alerts';

@Component({
  imports: [Avatar, PageHeader, RouterLink],
  selector: 'app-contact-details',
  styleUrl: './contact-details.scss',
  templateUrl: './contact-details.html',
})
export class ContactDetails implements OnInit {
  id = input.required({ transform: numberAttribute });
  contacto = signal<Contact | undefined>(undefined);
  loading = signal(true);
  contactsService = inject(ContactService);
  router = inject(Router);

  async ngOnInit(): Promise<void> {
    this.contacto.set(await this.contactsService.getContactById(this.id()));
    this.loading.set(false);
  }

  async eliminateContact(): Promise<void> {
    const contact = this.contacto();
    if (!contact || !(await confirmDelete(`${contact.firstName} ${contact.lastName}`))) {
      return;
    }
    if (!(await this.contactsService.deleteContact(contact.id))) {
      showToast('The contact could not be deleted', 'error');
      return;
    }
    showToast('Contact eliminated successfully');
    this.router.navigate(['/contacts']);
  }
}
