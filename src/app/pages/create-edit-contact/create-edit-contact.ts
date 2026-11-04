import { Component, computed, inject, input, numberAttribute, OnInit, signal } from '@angular/core';
import { email, form, FormField, pattern } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { PageHeader } from '../../components/page-header/page-header';
import { Contact } from '../../interfaces/contact';
import { ContactService } from '../../services/contact-service';
import { showToast } from '../../utils/alerts';
import { requiredText } from '../../utils/validators';

@Component({
  imports: [FormField, PageHeader],
  selector: 'app-create-edit-contact',
  styleUrl: './create-edit-contact.scss',
  templateUrl: './create-edit-contact.html',
})
export class CreateEditContact implements OnInit {
  contactService = inject(ContactService);
  router = inject(Router);

  id = input<number | undefined, string | undefined>(undefined, {
    transform: (value) => (value === undefined ? undefined : numberAttribute(value)),
  });
  isEditing = computed(() => this.id() !== undefined);

  newContactModel = signal<Required<Contact>>({
    id: 0,
    firstName: '',
    lastName: '',
    number: '',
    email: '',
    address: '',
    image: '',
    company: '',
    description: '',
    isFavorite: false,
    groupIds: [],
  });

  formCreateContact = form(this.newContactModel, (path) => {
    requiredText(path.firstName, 'Name is required');
    requiredText(path.lastName, 'Last name is required');
    requiredText(path.number, 'Phone is required');
    pattern(path.number, /^(?=.*\d)\+?[\d\s().-]+$/, { message: 'Enter a valid phone number' });
    email(path.email, { message: 'Enter a valid email address' });
  });

  ngOnInit(): void {
    const routeId = this.id();
    if (routeId === undefined) {
      return;
    }
    const contact = this.contactService.getContactById(routeId);
    if (!contact) {
      showToast('Contact not found', 'error');
      this.router.navigate(['/contacts']);
      return;
    }
    this.newContactModel.set({
      ...contact,
      number: contact.number ?? '',
      email: contact.email ?? '',
      address: contact.address ?? '',
      image: contact.image ?? '',
      company: contact.company ?? '',
      description: contact.description ?? '',
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const formState = this.formCreateContact();
    formState.markAsTouched();
    if (formState.invalid()) {
      formState.errorSummary()[0]?.fieldTree().focusBoundControl();
      return;
    }
    if (this.isEditing()) {
      this.modifyContact();
    } else {
      this.createContact();
    }
  }

  createContact(): void {
    const createdContact = this.contactService.addContact(this.newContactModel());
    showToast('Contact created successfully');
    this.router.navigate(['/contacts', createdContact.id]);
  }

  modifyContact(): void {
    this.contactService.editContact(this.newContactModel());
    showToast('Contact edited successfully');
    this.router.navigate(['/contacts', this.newContactModel().id]);
  }
}
