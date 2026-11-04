import { Component, inject, input, numberAttribute, OnInit } from '@angular/core';
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
  contact: Contact | undefined;
  contactService = inject(ContactService);
  router = inject(Router);

  ngOnInit(): void {
    this.contact = this.contactService.getContactById(this.id());
  }

  async eliminateContact(): Promise<void> {
    if (!this.contact) {
      return;
    }
    const { id, firstName, lastName } = this.contact;
    if (!(await confirmDelete(`${firstName} ${lastName}`))) {
      return;
    }
    this.contactService.deleteContact(id);
    showToast('Contact eliminated successfully');
    this.router.navigate(['/contacts']);
  }
}
