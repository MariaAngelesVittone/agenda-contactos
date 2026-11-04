export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  number?: string;
  address?: string;
  email?: string;
  image?: string;
  company?: string;
  description?: string;
  isFavorite: boolean;
  groupIds: number[];
}
