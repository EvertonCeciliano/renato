import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './ui/Card';
import SectionHeader from './ui/SectionHeader';
import OrderTable from './orders/OrderTable';
import { Order, OrderFormData, MenuItem, OrderItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;
const REFRESH_INTERVAL = 5000; // 5 seconds

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [newOrder, setNewOrder] = useState<OrderFormData>({
    table_number: '1',
    items: [],
    status: 'pending',
    total_amount: '0'
  });
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
    
    // Set up periodic refresh
    const ordersInterval = setInterval(fetchOrders, REFRESH_INTERVAL);
    const menuItemsInterval = setInterval(fetchMenuItems, REFRESH_INTERVAL);
    
    // Cleanup intervals on component unmount
    return () => {
      clearInterval(ordersInterval);
      clearInterval(menuItemsInterval);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/menu-items`);
      setMenuItems(response.data.map((item: MenuItem) => ({
        ...item,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
      })));
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const orderData = {
        ...(editingOrder || newOrder),
        table_number: parseInt(editingOrder ? editingOrder.table_number.toString() : newOrder.table_number),
        total_amount: total,
        items: selectedItems
      };
      
      const response = editingOrder
        ? await axios.put(`${API_URL}/api/orders/${editingOrder.id}`, orderData)
        : await axios.post(`${API_URL}/api/orders`, orderData);
      
      if (response.status === 200 || response.status === 201) {
        await Promise.all([
          fetchOrders(),
          fetchMenuItems()
        ]);
        
        setNewOrder({
          table_number: '1',
          items: [],
          status: 'pending',
          total_amount: '0'
        });
        setSelectedItems([]);
        setEditingOrder(null);
      }
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setNewOrder({
      table_number: order.table_number.toString(),
      items: order.items?.map(item => ({
        menu_item_id: item.id || item.menu_item_id,
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price)
      })) || [],
      status: order.status,
      total_amount: order.total_amount.toString()
    });
    setSelectedItems(order.items?.map(item => ({
      menu_item_id: item.id || item.menu_item_id,
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price)
    })) || []);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      const response = await axios.delete(`${API_URL}/api/orders/${id}`);
      
      if (response.status === 204) {
        await Promise.all([
          fetchOrders(),
          fetchMenuItems()
        ]);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingOrder) {
      setEditingOrder(prev => ({
        ...prev!,
        [name]: name === 'table_number' ? parseInt(value) || '' : value
      }));
    } else {
      setNewOrder(prev => ({
        ...prev,
        [name]: name === 'table_number' ? value : value
      }));
    }
  };

  const handleAddItem = (menuItem: MenuItem) => {
    const existingItem = selectedItems.find(item => item.menu_item_id === menuItem.id);
    
    if (existingItem) {
      setSelectedItems(prev => prev.map(item => 
        item.menu_item_id === menuItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems(prev => [...prev, {
        menu_item_id: menuItem.id,
        name: menuItem.name,
        quantity: 1,
        price: typeof menuItem.price === 'string' ? parseFloat(menuItem.price) : menuItem.price
      }]);
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setSelectedItems(prev => prev.filter(item => item.menu_item_id !== itemId));
  };

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    setSelectedItems(prev => prev.map(item =>
      item.menu_item_id === itemId ? { ...item, quantity, price: typeof item.price === 'string' ? parseFloat(item.price) : item.price } : item
    ));
  };

  const total = selectedItems.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return sum + (price * item.quantity);
  }, 0);

  const categories = ['all', ...new Set(menuItems.map(item => item.category || 'other'))];

  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 p-4 sm:p-6">
      <Card>
        <SectionHeader
          title={editingOrder ? 'Edit Order' : 'Create New Order'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-800">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="relative">
              <label htmlFor="table_number" className="block text-sm font-medium text-green-800">
                Table Number
              </label>
              <input
                type="number"
                name="table_number"
                id="table_number"
                value={editingOrder ? editingOrder.table_number : newOrder.table_number}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-green-800">
                Status
              </label>
              <select
                name="status"
                id="status"
                value={editingOrder ? editingOrder.status : newOrder.status}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm transition-colors duration-200 ${statusColors[editingOrder?.status || newOrder.status]}`}
              >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                      selectedCategory === category
                        ? 'bg-green-700 text-white'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
                <svg
                  className="absolute right-3 top-2.5 h-5 w-5 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredMenuItems.map(item => (
                  <motion.button
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    type="button"
                    onClick={() => handleAddItem(item)}
                    disabled={!item.is_available}
                    className={`p-4 text-left rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                      item.is_available
                        ? 'border-green-200 hover:border-green-500 hover:bg-green-50 hover:shadow-md'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="font-medium text-sm text-green-900">{item.name}</div>
                    <div className="text-xs text-green-700 mt-1">
                      ${(typeof item.price === 'string' ? parseFloat(item.price) : item.price).toFixed(2)}
                    </div>
                    {!item.is_available && (
                      <span className="inline-block mt-2 text-xs text-red-600">
                        Not available
                      </span>
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {selectedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <label className="block text-sm font-medium text-green-800">
                  Selected Items
                </label>
                <div className="space-y-2">
                  {selectedItems.map(item => (
                    <motion.div
                      key={item.menu_item_id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-green-200 hover:border-green-300 hover:shadow-sm transition-all duration-200"
                    >
                      <div>
                        <div className="font-medium text-green-900">{item.name}</div>
                        <div className="text-sm text-green-700">
                          ${((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.menu_item_id, item.quantity - 1)}
                          className="p-1.5 rounded-full text-green-700 hover:text-green-900 hover:bg-green-100 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <span className="text-sm font-medium w-8 text-center text-green-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.menu_item_id, item.quantity + 1)}
                          className="p-1.5 rounded-full text-green-700 hover:text-green-900 hover:bg-green-100 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.menu_item_id)}
                          className="p-1.5 rounded-full text-red-600 hover:text-red-800 hover:bg-red-100 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  <motion.div
                    layout
                    className="flex justify-between items-center p-4 bg-green-50 rounded-lg"
                  >
                    <span className="text-green-800 font-medium">Total Amount</span>
                    <span className="text-lg font-bold text-green-800">
                      ${total.toFixed(2)}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end space-x-3">
            {editingOrder && (
              <button
                type="button"
                onClick={() => {
                  setEditingOrder(null);
                  setNewOrder({
                    table_number: '1',
                    items: [],
                    status: 'pending',
                    total_amount: '0'
                  });
                  setSelectedItems([]);
                }}
                className="px-4 py-2 border border-green-300 text-green-700 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || selectedItems.length === 0}
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 ${
                isSubmitting || selectedItems.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-700 hover:bg-green-800 text-white'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{editingOrder ? 'Updating...' : 'Creating...'}</span>
                </span>
              ) : (
                <span>{editingOrder ? 'Update Order' : 'Create Order'}</span>
              )}
            </button>
          </div>
        </form>
      </Card>

      <Card>
        <SectionHeader
          title="Orders"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-800">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
        <OrderTable
          orders={orders}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>
    </div>
  );
} 