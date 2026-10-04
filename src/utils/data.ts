export interface UserData {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}

export interface CardData {
  name: string;
  number: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

let counter = 0;

/** Unique per run, per worker and per call, so parallel tests never collide. */
export function uniqueEmail(prefix = 'qa'): string {
  counter += 1;
  return `${prefix}.${Date.now()}.${process.pid}.${counter}@example.com`;
}

export function buildUser(overrides: Partial<UserData> = {}): UserData {
  return {
    name: 'QA Tester',
    email: uniqueEmail(),
    password: 'Passw0rd!123',
    title: 'Mr',
    birthDay: '15',
    birthMonth: 'June',
    birthYear: '1990',
    firstName: 'QA',
    lastName: 'Tester',
    company: 'Test Co',
    address: '1 Test Street',
    address2: 'Suite 2',
    country: 'Canada',
    state: 'Ontario',
    city: 'Toronto',
    zipcode: 'M5V 2T6',
    mobile: '+14165550123',
    ...overrides,
  };
}

export const VALID_CARD: CardData = {
  name: 'QA Tester',
  number: '4111111111111111',
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2030',
};
