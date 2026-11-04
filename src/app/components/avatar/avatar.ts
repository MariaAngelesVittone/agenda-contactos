import { Component, computed, input } from '@angular/core';
import { Contact } from '../../interfaces/contact';

@Component({
  host: { 'aria-hidden': 'true' },
  selector: 'app-avatar',
  styleUrl: './avatar.scss',
  templateUrl: './avatar.html',
})
export class Avatar {
  contact = input.required<Contact>();

  initials = computed(() => {
    const { name, lastname } = this.contact();
    return (name.charAt(0) + lastname.charAt(0)).toUpperCase();
  });
}
