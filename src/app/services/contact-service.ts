import { Injectable } from '@angular/core';
import { Contact } from '../interfaces/contact';

@Injectable({ providedIn: 'root' })
export class ContactService {
  contacts: Contact[] = [
    {
      id: '1',
      name: 'Angie',
      lastname: 'Vittone',
      email: 'Angievittone@email.com',
      phone: '123456789',
    },
  ];

  addContact(contact: Contact): string {
    const newId = String(this.contacts.length + 1);
    this.contacts.push({
      ...contact,
      id: newId,
    });
    return newId;
  }

  getContactById(id: string): Contact | undefined {
    return this.contacts.find((contact) => contact.id === id);
  }

  deleteContact(id: string): void {
    this.contacts = this.contacts.filter((contact) => contact.id !== id);
  }

  editContact(contact: Contact): void {
    this.contacts = this.contacts.map((current) =>
      current.id === contact.id ? contact : current,
    );
  }
}