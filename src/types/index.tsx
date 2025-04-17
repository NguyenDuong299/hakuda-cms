export interface Users {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  password: string;
  confirmPassword: string;
}

export interface Posts{
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    author: string;
    hot: boolean;
  }