export interface User {
  UserID: number;
  Username: string;
  Role: 'Admin' | 'Customer';
  FirstName: string;
  LastName: string;
  Email: string;
  Phone?: string;
  ShippingAddress?: string;
  CreatedAt?: string;
}

export interface Book {
  ISBN: string;
  Title: string;
  PublicationYear?: number;
  SellingPrice: number;
  QuantityInStock: number;
  ReorderThreshold: number;
  PublisherID: number;
  PublisherName: string;
  CategoryID: number;
  CategoryName: string;
  Authors?: string | Author[];
  InStock?: boolean;
}

export interface Author {
  AuthorID: number;
  Name: string;
}

export interface Publisher {
  PublisherID: number;
  Name: string;
  Address?: string;
  Phone?: string;
}

export interface Category {
  CategoryID: number;
  CategoryName: string;
}

export interface CartItem {
  CartItemID: number;
  ISBN: string;
  Title: string;
  SellingPrice: number;
  Quantity: number;
  Subtotal: number;
  QuantityInStock: number;
  Authors?: string;
}

export interface Cart {
  cartId: number;
  items: CartItem[];
  total: string;
  itemCount: number;
}

export interface CustomerOrder {
  CustOrderID: number;
  OrderDate: string;
  TotalAmount: number;
  Status: string;
  CreditCardLast4?: string;
  CreditCardExpiry?: string;
  UserID?: number;
  Username?: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  ShippingAddress?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  CustOrderItemID: number;
  ISBN: string;
  Title: string;
  Quantity: number;
  UnitPrice: number;
  Subtotal: number;
  Authors?: string;
}

export interface PublisherOrder {
  PubOrderID: number;
  OrderDate: string;
  Status: 'Pending' | 'Confirmed' | 'Cancelled';
  TotalAmount: number;
  PublisherID: number;
  PublisherName: string;
  PublisherAddress?: string;
  PublisherPhone?: string;
  items?: PublisherOrderItem[];
}

export interface PublisherOrderItem {
  PubOrderItemID: number;
  ISBN: string;
  Title: string;
  Quantity: number;
  UnitPrice: number;
  Subtotal: number;
  QuantityInStock?: number;
  ReorderThreshold?: number;
}

export interface DashboardStats {
  TotalBooks: number;
  TotalCustomers: number;
  TotalOrders: number;
  TotalRevenue: number;
  PendingPublisherOrders: number;
  LowStockBooks: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  shippingAddress?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}
