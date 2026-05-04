export interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  countryOfOrigin: string;
  placeOfResidence: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
