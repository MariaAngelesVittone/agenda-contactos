import { Component, computed, input, signal } from '@angular/core';
import { Contact } from '../../interfaces/contact';

@Component({
  host: { 'aria-hidden': 'true' },
  selector: 'app-avatar',
  styleUrl: './avatar.scss',
  templateUrl: './avatar.html',
})
export class Avatar {
  contact = input.required<Contact>();
  private failedImage = signal('');

  imageUrl = computed(() => {
    const image = this.contact().image;
    return image && image !== this.failedImage() ? image : '';
  });

  initials = computed(() => {
    const { firstName, lastName } = this.contact();
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  });

  onImageError(): void {
    this.failedImage.set(this.contact().image ?? '');
  }
}
