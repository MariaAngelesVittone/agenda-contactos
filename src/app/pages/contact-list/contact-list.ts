import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Avatar } from '../../components/avatar/avatar';
import { ContactService } from '../../services/contact-service';

@Component({
  imports: [Avatar, RouterLink],
  selector: 'app-contact-list',
  styleUrl: './contact-list.scss',
  templateUrl: './contact-list.html',
})
export class ContactList {
  readonly contactService = inject(ContactService);

  get contacts() {
    return this.contactService.contacts;
  }

  eliminateContact(id: string): void {
    this.contactService.deleteContact(id);
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
      title: 'Contact eliminated successfully',
    });
  }
}
