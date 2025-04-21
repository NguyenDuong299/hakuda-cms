export interface Users {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address_province: string;
  address_district: string;
  address_ward: string;
  addressDetail: string;
  created_at: string;
  updated_at: string;
}

export interface Posts {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  author: string;
  hot: boolean;
  created_at: string;
  updated_at: string;
}
export interface Banners {
  id: string;
  name: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}
