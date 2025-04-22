export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}

export interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  is_available: boolean;
}

export interface OrderItem {
  id?: number;
  menu_item_id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  table_number: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total_amount: number;
  items: OrderItem[];
  created_at?: string;
  updated_at?: string;
}

export interface OrderFormData {
  table_number: string;
  status: Order['status'];
  total_amount: string;
  items: OrderItem[];
}