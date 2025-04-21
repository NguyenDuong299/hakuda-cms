export interface Users {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addressProvinceCode: string;
  addressDistrictCode: string;
  addressWardCode: string;
  addressDesc: string;
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

export interface Vouchers {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  quantity: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
