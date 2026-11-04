import { computed, inject, Injectable, signal } from '@angular/core';
import { Contact } from '../interfaces/contact';
import { readStorage, writeStorage } from '../utils/storage';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly authService = inject(AuthService);
  private readonly contactsByUser = signal(readStorage<Record<number, Contact[]>>('contacts', {}));
  private nextId = readStorage('nextContactId', 1);

  readonly contacts = computed(() => this.contactsByUser()[this.authService.userId() ?? 0] ?? []);

  getContactById(id: number): Contact | undefined {
    return this.contacts().find((contact) => contact.id === id);
  }

  addContact(contact: Contact): Contact {
    const created = { ...contact, id: this.nextId++ };
    writeStorage('nextContactId', this.nextId);
    this.update((contacts) => [...contacts, created]);
    return created;
  }

  editContact(contact: Contact): void {
    this.update((contacts) =>
      contacts.map((current) => (current.id === contact.id ? contact : current)),
    );
  }

  deleteContact(id: number): void {
    this.update((contacts) => contacts.filter((contact) => contact.id !== id));
  }

  private update(change: (contacts: Contact[]) => Contact[]): void {
    const userId = this.authService.userId();
    if (userId === null) {
      return;
    }
    this.contactsByUser.update((all) => ({ ...all, [userId]: change(all[userId] ?? []) }));
    writeStorage('contacts', this.contactsByUser());
  }
}
