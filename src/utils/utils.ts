export const API_URL = "http://localhost:3333";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface IUserDetails {
  id: number;
  description: string;
}
