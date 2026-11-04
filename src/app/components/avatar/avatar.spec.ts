import { TestBed } from '@angular/core/testing';
import { Contact } from '../../interfaces/contact';
import { Avatar } from './avatar';

const contact: Contact = {
  id: 1,
  firstName: 'Ana',
  lastName: 'Perez',
  isFavorite: false,
  groupIds: [],
};

describe('Avatar', () => {
  const render = async (value: Contact) => {
    const fixture = TestBed.createComponent(Avatar);
    fixture.componentRef.setInput('contact', value);
    await fixture.whenStable();
    return fixture;
  };

  it('shows the initials when the contact has no image', async () => {
    const fixture = await render(contact);

    expect(fixture.nativeElement.textContent.trim()).toBe('AP');
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });

  it('shows the image when the contact has one', async () => {
    const fixture = await render({ ...contact, image: 'https://example.com/ana.png' });

    expect(fixture.nativeElement.querySelector('img')?.getAttribute('src')).toBe(
      'https://example.com/ana.png',
    );
  });

  it('goes back to the initials when the image cannot be loaded', async () => {
    const fixture = await render({ ...contact, image: 'string' });

    fixture.nativeElement.querySelector('img').dispatchEvent(new Event('error'));
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(fixture.nativeElement.textContent.trim()).toBe('AP');
  });
});
