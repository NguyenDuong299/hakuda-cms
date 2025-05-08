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
  id: number;
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
  brand_id: Brands[] | null;
  product_line_id: ProductLines[] | null;
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

export interface ExportReceipts {
  id: number;
  order_id: number;
  export_date: string;
  total_amount: number;
  user_id: number;
  status: string;
  export_receipt_details: ExportReceiptItems[];
  createdAt: string;
  updatedAt: string;
}
export interface ExportReceiptItems {
  id: number;
  quantity: number;
  product_id: number;
  export_price: number;
  createdAt: string;
  updatedAt: string;
}
export interface Suppliers {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}
export interface ImportReceipts {
  id: number;
  supplier_id: number;
  supplier_name: string;
  import_date: string;
  total_amount: number;
  note: string;
  import_receipt_details: ImportReceiptDetails[];
  createdAt: string;
  updatedAt: string;
}
export interface ImportReceiptDetails {
  id: number;
  quantity: number;
  import_price: number;
  product_id: number;
  createdAt: string;
  updatedAt: string;
}