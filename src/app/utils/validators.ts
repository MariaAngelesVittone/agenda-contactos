import { pattern, required, SchemaPath } from '@angular/forms/signals';

export function requiredText(path: SchemaPath<string>, message: string): void {
  required(path, { message });
  pattern(path, /\S/, { message });
}
