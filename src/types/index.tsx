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
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}
export interface ProductLines {
  id: number;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
export interface Brands {
  id: number;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Products {
  id: number;
  code: string;
  name: string;
  description: string;
  detail: string;
  price: number;
  stock_quantity: number;
  isDiscount: boolean;
  hot: boolean;
  brand_id: Brands[];
  product_line_id: ProductLines[];
  images: ProductImages[];
  createdAt: string;
  updatedAt: string;
}
export interface ProductImages {
  id: number;
  product_id: string;
  image_url: string;
  isThumbnail: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Orders {
  id: number;
  user_id: number;
  voucher_id: number;
  total_price: number;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  note: string;
  status: string;
  order_items: OrderItems[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItems {
  id: number;
  code: string;
  brand: string;
  price: number;
  quantity: number;
  product_line: string;
  product_name: string;
}
