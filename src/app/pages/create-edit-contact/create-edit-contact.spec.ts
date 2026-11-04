import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Contact } from '../../interfaces/contact';
import { useMemoryStorage } from '../../testing/memory-storage';
import { CreateEditContact } from './create-edit-contact';

describe('CreateEditContact', () => {
  let fixture: ComponentFixture<CreateEditContact>;
  let component: CreateEditContact;

  beforeEach(() => {
    useMemoryStorage();
    TestBed.configureTestingModule({
      imports: [CreateEditContact],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(CreateEditContact);
    component = fixture.componentInstance;
  });

  const fillIn = (changes: Partial<Contact>) =>
    component.newContactModel.update((model) => ({ ...model, ...changes }));

  const messages = (field: 'firstName' | 'lastName' | 'number' | 'email') =>
    component.formCreateContact[field]()
      .errors()
      .map((error) => error.message);

  it('asks for name, last name and phone', () => {
    expect(messages('firstName')).toEqual(['Name is required']);
    expect(messages('lastName')).toEqual(['Last name is required']);
    expect(messages('number')).toEqual(['Phone is required']);
  });

  it('accepts the usual phone formats', () => {
    fillIn({ number: '11 5555-0000' });
    expect(messages('number')).toEqual([]);

    fillIn({ number: '+54 (11) 5555-0000' });
    expect(messages('number')).toEqual([]);
  });

  it('rejects a phone without digits', () => {
    fillIn({ number: 'abc' });

    expect(messages('number')).toEqual(['Enter a valid phone number']);
  });

  it('keeps the email optional but checks its format', () => {
    expect(messages('email')).toEqual([]);

    fillIn({ email: 'nope' });
    expect(messages('email')).toEqual(['Enter a valid email address']);

    fillIn({ email: 'ana@example.com' });
    expect(messages('email')).toEqual([]);
  });

  it('is in edit mode only when the route has an id', () => {
    expect(component.isEditing()).toBe(false);

    fixture.componentRef.setInput('id', '3');

    expect(component.isEditing()).toBe(true);
    expect(component.id()).toBe(3);
  });
});
