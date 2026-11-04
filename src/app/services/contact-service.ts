import { inject, Injectable, signal } from '@angular/core';
import { Contact } from '../interfaces/contact';
import { showToast } from '../utils/alerts';
import { apiFetch } from '../utils/api';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly authService = inject(AuthService);

  readonly contacts = signal<Contact[]>([]);

  async loadContacts(): Promise<boolean> {
    const res = await this.request('');
    if (!res.ok) {
      return false;
    }
    this.contacts.set(await res.json());
    return true;
  }

  async getContactById(id: number): Promise<Contact | undefined> {
    const res = await this.request(`/${id}`);
    return res.status === 200 ? await res.json() : undefined;
  }

  async addContact(contact: Contact): Promise<Contact | undefined> {
    const res = await this.request('', { method: 'POST', body: this.withoutBlanks(contact) });
    if (!res.ok) {
      return undefined;
    }
    const created: Contact = { groupIds: [], ...(await res.json()) };
    this.contacts.update((contacts) => [...contacts, created]);
    return created;
  }

  async editContact(contact: Contact): Promise<boolean> {
    const res = await this.request(`/${contact.id}`, {
      method: 'PUT',
      body: this.withoutBlanks(contact),
    });
    if (!res.ok) {
      return false;
    }
    this.contacts.update((contacts) =>
      contacts.map((current) => (current.id === contact.id ? contact : current)),
    );
    return true;
  }

  async deleteContact(id: number): Promise<boolean> {
    const res = await this.request(`/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      return false;
    }
    this.contacts.update((contacts) => contacts.filter((contact) => contact.id !== id));
    return true;
  }

  private async request(path: string, init?: RequestInit): Promise<Response> {
    const res = await apiFetch(`/contacts${path}`, init, this.authService.token());
    if (res.status === 401) {
      showToast('Your session has expired. Please log in again.', 'error');
      this.authService.logout();
    }
    return res;
  }

  private withoutBlanks(contact: Contact): string {
    return JSON.stringify(contact, (_key, value) => (value === '' ? undefined : value));
  }
}
