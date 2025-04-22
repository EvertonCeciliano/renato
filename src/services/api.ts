import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}

export interface OrderItem {
  id: number;
  menu_item_id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  table_number: number;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

export const menuApi = {
  getAll: () => api.get<MenuItem[]>('/menu-items'),
  create: (data: Omit<MenuItem, 'id'>) => api.post('/menu-items', data),
  update: (id: number, data: Partial<MenuItem>) => api.put(`/menu-items/${id}`, data),
  delete: (id: number) => api.delete(`/menu-items/${id}`),
};

export const ordersApi = {
  getAll: () => api.get<Order[]>('/orders'),
  create: (data: { table_number: number; items: { id: number; quantity: number; price: number; }[] }) => 
    api.post('/orders', data),
  updateStatus: (id: number, status: string) => api.put(`/orders/${id}`, { status }),
};