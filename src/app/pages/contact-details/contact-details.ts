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
  contacto: Contact | undefined;
  contactsService = inject(ContactService);
  router = inject(Router);

  ngOnInit(): void {
    this.contacto = this.contactsService.getContactById(this.id());
  }

  async eliminateContact(): Promise<void> {
    if (!this.contacto) {
      return;
    }
    const { id, firstName, lastName } = this.contacto;
    if (!(await confirmDelete(`${firstName} ${lastName}`))) {
      return;
    }
    this.contactsService.deleteContact(id);
    showToast('Contact eliminated successfully');
    this.router.navigate(['/contacts']);
  }
}
