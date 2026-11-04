import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { requiredText } from './validators';

describe('requiredText', () => {
  const messageFor = (value: string) => {
    const model = signal({ name: value });
    const nameForm = TestBed.runInInjectionContext(() =>
      form(model, (path) => requiredText(path.name, 'Name is required')),
    );
    return nameForm.name().errors()[0]?.message;
  };

  it('asks for a value when the field is empty', () => {
    expect(messageFor('')).toBe('Name is required');
  });

  it('asks for a value when the field only has spaces', () => {
    expect(messageFor('   ')).toBe('Name is required');
  });

  it('accepts a real value', () => {
    expect(messageFor('Ana')).toBeUndefined();
  });
});
