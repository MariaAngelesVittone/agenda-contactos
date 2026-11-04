import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Contact } from '../interfaces/contact';
import { useMemoryStorage } from '../testing/memory-storage';
import { AuthService } from './auth-service';
import { ContactService } from './contact-service';

const newContact: Contact = {
  id: 0,
  firstName: 'Ana',
  lastName: 'Perez',
  number: '11 5555-0000',
  isFavorite: false,
  groupIds: [],
};

describe('ContactService', () => {
  let service: ContactService;
  let authService: AuthService;

  beforeEach(() => {
    useMemoryStorage();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    authService = TestBed.inject(AuthService);
    service = TestBed.inject(ContactService);
    authService.userId.set(1);
  });

  it('adds contacts with different ids', () => {
    const first = service.addContact(newContact);
    const second = service.addContact(newContact);

    expect(first.id).not.toBe(second.id);
    expect(service.contacts()).toEqual([first, second]);
  });

  it('does not reuse the id of a deleted contact', () => {
    const first = service.addContact(newContact);
    service.deleteContact(first.id);

    expect(service.addContact(newContact).id).not.toBe(first.id);
  });

  it('finds a contact by id', () => {
    const created = service.addContact(newContact);

    expect(service.getContactById(created.id)).toEqual(created);
    expect(service.getContactById(999)).toBeUndefined();
  });

  it('edits a contact', () => {
    const created = service.addContact(newContact);
    service.editContact({ ...created, firstName: 'Maria' });

    expect(service.getContactById(created.id)?.firstName).toBe('Maria');
  });

  it('deletes a contact', () => {
    const created = service.addContact(newContact);
    service.deleteContact(created.id);

    expect(service.contacts()).toEqual([]);
  });

  it('keeps the contacts of each user separate', () => {
    service.addContact(newContact);

    authService.userId.set(2);
    expect(service.contacts()).toEqual([]);

    authService.userId.set(1);
    expect(service.contacts()).toHaveLength(1);
  });

  it('does not save anything when nobody is logged in', () => {
    authService.userId.set(null);
    service.addContact(newContact);

    expect(localStorage.getItem('agenda:contacts')).toBeNull();
  });

  it('keeps the contacts after a reload', () => {
    const created = service.addContact(newContact);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    TestBed.inject(AuthService).userId.set(1);

    expect(TestBed.inject(ContactService).contacts()).toEqual([created]);
  });
});
