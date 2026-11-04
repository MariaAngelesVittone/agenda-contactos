import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import Swal from 'sweetalert2';
import { Contact } from '../interfaces/contact';
import { AuthService } from './auth-service';
import { ContactService } from './contact-service';

const contact: Contact = {
  id: 1,
  firstName: 'Ana',
  lastName: 'Perez',
  number: '11 5555-0000',
  isFavorite: false,
  groupIds: [],
};

describe('ContactService', () => {
  let service: ContactService;
  let authService: AuthService;
  let fetchMock: ReturnType<typeof vi.fn>;

  const reply = (status: number, body?: unknown) =>
    fetchMock.mockResolvedValueOnce(
      new Response(body === undefined ? null : JSON.stringify(body), { status }),
    );

  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {} });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    });
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    authService = TestBed.inject(AuthService);
    service = TestBed.inject(ContactService);
    authService.token.set('the-token');
  });

  afterEach(() => Swal.close());

  it('loads the contacts of the logged in user', async () => {
    reply(200, [contact]);

    expect(await service.loadContacts()).toBe(true);
    expect(service.contacts()).toEqual([contact]);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/contacts$/);
    expect(init.headers.authorization).toBe('Bearer the-token');
  });

  it('reports a failed load and keeps the list empty', async () => {
    reply(500);

    expect(await service.loadContacts()).toBe(false);
    expect(service.contacts()).toEqual([]);
  });

  it('finds a contact by id and treats an empty answer as not found', async () => {
    reply(200, contact);
    expect(await service.getContactById(1)).toEqual(contact);

    reply(204);
    expect(await service.getContactById(99)).toBeUndefined();
  });

  it('adds a contact, leaving blank fields out of the request', async () => {
    reply(201, { ...contact, id: 7 });

    const created = await service.addContact({ ...contact, id: 0, email: '', address: '' });

    expect(created).toEqual({ ...contact, id: 7 });
    expect(service.contacts()).toEqual([{ ...contact, id: 7 }]);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).not.toHaveProperty('email');
    expect(body).not.toHaveProperty('address');
  });

  it('fills in the groups when the server does not send them', async () => {
    reply(201, { id: 7, firstName: 'Ana', lastName: 'Perez', isFavorite: false });

    expect((await service.addContact(contact))?.groupIds).toEqual([]);
  });

  it('does not add a contact the server refused', async () => {
    reply(400);

    expect(await service.addContact(contact)).toBeUndefined();
    expect(service.contacts()).toEqual([]);
  });

  it('edits a contact', async () => {
    reply(200, [contact]);
    await service.loadContacts();
    reply(204);

    expect(await service.editContact({ ...contact, firstName: 'Maria' })).toBe(true);
    expect(service.contacts()[0].firstName).toBe('Maria');
    expect(fetchMock.mock.calls[1][1].method).toBe('PUT');
  });

  it('keeps the list as it was when an edit is refused', async () => {
    reply(200, [contact]);
    await service.loadContacts();
    reply(404);

    expect(await service.editContact({ ...contact, firstName: 'Maria' })).toBe(false);
    expect(service.contacts()[0].firstName).toBe('Ana');
  });

  it('deletes a contact', async () => {
    reply(200, [contact]);
    await service.loadContacts();
    reply(204);

    expect(await service.deleteContact(1)).toBe(true);
    expect(service.contacts()).toEqual([]);
    expect(fetchMock.mock.calls[1][1].method).toBe('DELETE');
  });

  it('keeps the contact when the delete is refused', async () => {
    reply(200, [contact]);
    await service.loadContacts();
    reply(500);

    expect(await service.deleteContact(1)).toBe(false);
    expect(service.contacts()).toEqual([contact]);
  });

  it('logs the user out when the session has expired', async () => {
    const logout = vi.spyOn(authService, 'logout').mockImplementation(() => {});
    reply(401);

    expect(await service.loadContacts()).toBe(false);
    expect(logout).toHaveBeenCalledOnce();
  });
});
