export interface OrderItem {
  item: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  paymentMethod: 'cash' | 'card';
  status: 'pending' | 'completed' | 'cancelled';
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}