import { Component, inject, input, OnInit, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Contact } from '../../interfaces/contact';
import { ContactService } from '../../services/contact-service';

@Component({
  imports: [FormField],
  selector: 'app-create-edit-contact',
  styleUrl: './create-edit-contact.scss',
  templateUrl: './create-edit-contact.html',
})
export class CreateEditContact implements OnInit {
  contactService = inject(ContactService);
  router = inject(Router);

  id = input<string>();

  newContactModel = signal<Contact>({
    id: '',
    name: '',
    lastname: '',
    phone: '',
  });

  formCreateContact = form(this.newContactModel);

  ngOnInit(): void {
    const routeId = this.id();
    if (routeId) {
      const contact = this.contactService.getContactById(routeId);
      if (contact) {
        this.newContactModel.set(contact);
      }
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.id()) {
      this.modifyContact();
    } else {
      this.createContact();
    }
  }

  createContact(): void {
    const createdContact = this.contactService.addContact(this.newContactModel());

    Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    }).fire({
      icon: 'success',
      title: 'Contact created successfully',
    });

    this.router.navigate(['/contacts', createdContact]);
  }

  modifyContact(): void {
    this.contactService.editContact(this.newContactModel());

    Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    }).fire({
      icon: 'success',
      title: 'Contact edited successfully',
    });

    this.router.navigate(['/contacts', this.newContactModel().id]);
  }
}
