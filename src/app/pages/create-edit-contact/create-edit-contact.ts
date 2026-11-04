import { Component, inject, input, OnInit, signal } from '@angular/core';
import { email, form, FormField, pattern, required, SchemaPath } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { Contact } from '../../interfaces/contact';
import { ContactService } from '../../services/contact-service';
import { showToast } from '../../utils/alerts';

function requiredText(path: SchemaPath<string>, message: string): void {
  required(path, { message });
  pattern(path, /\S/, { message });
}

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-create-edit-contact',
  styleUrl: './create-edit-contact.scss',
  templateUrl: './create-edit-contact.html',
})
export class CreateEditContact implements OnInit {
  contactService = inject(ContactService);
  router = inject(Router);

  id = input<string>();

  newContactModel = signal<Required<Contact>>({
    id: '',
    name: '',
    lastname: '',
    phone: '',
    email: '',
    address: '',
    imgUrl: '',
  });

  formCreateContact = form(this.newContactModel, (path) => {
    requiredText(path.name, 'Name is required');
    requiredText(path.lastname, 'Last name is required');
    requiredText(path.phone, 'Phone is required');
    pattern(path.phone, /^(?=.*\d)\+?[\d\s().-]+$/, { message: 'Enter a valid phone number' });
    email(path.email, { message: 'Enter a valid email address' });
  });

  ngOnInit(): void {
    const routeId = this.id();
    if (routeId) {
      const contact = this.contactService.getContactById(routeId);
      if (contact) {
        this.newContactModel.set({ ...this.newContactModel(), ...contact });
      } else {
        this.router.navigate(['/contacts']);
      }
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const formState = this.formCreateContact();
    formState.markAsTouched();
    if (formState.invalid()) {
      formState.errorSummary()[0]?.fieldTree().focusBoundControl();
      return;
    }
    if (this.id()) {
      this.modifyContact();
    } else {
      this.createContact();
    }
  }

  createContact(): void {
    const createdContact = this.contactService.addContact(this.newContactModel());
    showToast('Contact created successfully');
    this.router.navigate(['/contacts', createdContact]);
  }

  modifyContact(): void {
    this.contactService.editContact(this.newContactModel());
    showToast('Contact edited successfully');
    this.router.navigate(['/contacts', this.newContactModel().id]);
  }
}
