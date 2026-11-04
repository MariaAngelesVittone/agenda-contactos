import { Injectable, signal } from '@angular/core';
import { Contact } from '../interfaces/contact';

@Injectable({ providedIn: 'root' })
export class ContactService {
  readonly contacts = signal<Contact[]>([
    {
      id: '1',
      name: 'Angie',
      lastname: 'Vittone',
      email: 'Angievittone@email.com',
      phone: '123456789',
    },
  ]);

  addContact(contact: Contact): string {
    const newId = crypto.randomUUID();
    this.contacts.update((contacts) => [...contacts, { ...contact, id: newId }]);
    return newId;
  }

  getContactById(id: string): Contact | undefined {
    return this.contacts().find((contact) => contact.id === id);
  }

  deleteContact(id: string): void {
    this.contacts.update((contacts) => contacts.filter((contact) => contact.id !== id));
  }

  editContact(contact: Contact): void {
    this.contacts.update((contacts) =>
      contacts.map((current) => (current.id === contact.id ? contact : current)),
    );
  }
}
