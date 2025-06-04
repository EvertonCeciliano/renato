import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import OrderTable from './orders/OrderTable';
import { Order, OrderFormData, MenuItem, OrderItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';
const REFRESH_INTERVAL = 5000; // 5 seconds

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  preparing: 'Preparando',
  ready: 'Pronto',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};
const statusColors: Record<string, string> = {
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
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

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

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/orders`);
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    const res = await axios.get(`${API_URL}/menu-items`);
    setMenuItems(res.data);
  };

  const openModal = (order: Order | null = null) => {
    setEditingOrder(order);
    if (order) {
      setSelectedItems(order.items?.map((i: any) => ({ ...i, price: Number(i.price) })) || []);
    } else {
      setSelectedItems([]);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingOrder(null);
    setSelectedItems([]);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingOrder) {
      setEditingOrder(prev => ({
        ...prev!,
        [name]: name === 'table_number' ? parseInt(value) || '' : value
      }));
    }
  };

  const handleAddItem = (item: MenuItem) => {
    const exists = selectedItems.find(i => i.menu_item_id === item.id);
    if (exists) {
      setSelectedItems(prev => prev.map(i => i.menu_item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setSelectedItems(prev => [...prev, { menu_item_id: item.id, name: item.name, quantity: 1, price: Number(item.price) }]);
    }
  };

  const handleRemoveItem = (id: number) => setSelectedItems(prev => prev.filter(i => i.menu_item_id !== id));

  const handleUpdateQuantity = (id: number, q: number) => {
    if (q < 1) return handleRemoveItem(id);
    setSelectedItems(prev => prev.map(i => i.menu_item_id === id ? { ...i, quantity: q } : i));
  };

  const total = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        ...(editingOrder || {}),
        table_number: parseInt(editingOrder?.table_number?.toString() || '1'),
        items: selectedItems,
        total_amount: total,
      };
      if (editingOrder) {
        await axios.put(`${API_URL}/orders/${editingOrder.id}`, data);
      } else {
        await axios.post(`${API_URL}/orders`, data);
      }
      fetchOrders();
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setShowConfirm(false);
  };

  const handleDelete = async (id: number | null) => {
    setDeleteLoading(true);
    try {
      if (id !== null) {
        await axios.delete(`${API_URL}/orders/${id}`);
        setSuccess('Pedido excluído com sucesso!');
        fetchOrders();
      }
    } catch (err) {
      setError('Erro ao excluir o pedido.');
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
      setShowConfirm(false);
    }
  };

  const handleUpdateStatus = async (order: Order, newStatus: string) => {
    try {
      await axios.put(`${API_URL}/orders/${order.id}`, {
        table_number: order.table_number,
        status: newStatus,
        items: order.items,
        total_amount: order.total_amount,
      });
      setSuccess('Status atualizado com sucesso!');
      fetchOrders();
    } catch (err) {
      setError('Erro ao atualizar o status do pedido.');
    }
  };

  const filteredOrders = orders.filter((o: Order) =>
    (filter === 'all' || o.status === filter) &&
    (search === '' || String(o.table_number).includes(search))
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-2">
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div className="flex"><div className="ml-3"><p className="text-sm text-green-700">{success}</p></div></div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex"><div className="ml-3"><p className="text-sm text-red-700">{error}</p></div></div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-green-800">Pedidos</h1>
        <button
          onClick={() => openModal()}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-xl font-semibold shadow transition"
        >
          Novo Pedido
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="rounded-xl border-2 border-green-300 px-4 py-2 bg-green-50 text-green-800 font-medium"
        >
          <option value="all">Todos os Status</option>
          <option value="pending">Pendente</option>
          <option value="preparing">Preparando</option>
          <option value="ready">Pronto</option>
          <option value="delivered">Entregue</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <input
          type="text"
          placeholder="Buscar por mesa..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-xl border-2 border-green-300 px-4 py-2 bg-green-50 text-green-800 font-medium"
        />
      </div>
      {loading ? (
        <div className="text-center text-green-700 py-12 text-lg">Carregando pedidos...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500 py-12 text-lg">Nenhum pedido encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order: Order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 border-2 border-green-100"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-800">Mesa {order.table_number}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                  <select
                    value={order.status}
                    onChange={e => handleUpdateStatus(order, e.target.value)}
                    className="ml-2 rounded border px-2 py-1 text-xs"
                  >
                    <option value="pending">Pendente</option>
                    <option value="preparing">Preparando</option>
                    <option value="ready">Pronto</option>
                    <option value="delivered">Entregue</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {order.items && order.items.map((item: OrderItem) => (
                  <span key={item.menu_item_id} className="bg-green-50 text-green-900 px-2 py-1 rounded text-xs">
                    {item.name} x{item.quantity}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-green-700 font-semibold">Total: R$ {Number(order.total_amount).toFixed(2)}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(order)}
                    className="px-3 py-1 rounded-lg bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 transition"
                  >Editar</button>
                  <button
                    onClick={() => confirmDelete(order.id)}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 shadow transition"
                    disabled={deleteLoading && deleteId === order.id}
                  >{deleteLoading && deleteId === order.id ? 'Excluindo...' : 'Excluir'}</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-green-700 hover:text-green-900 text-2xl font-bold"
                aria-label="Fechar"
              >×</button>
              <h2 className="text-2xl font-bold text-green-800 mb-6">{editingOrder ? 'Editar Pedido' : 'Novo Pedido'}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-green-800 font-medium mb-1">Número da Mesa</label>
                  <input
                    type="number"
                    name="table_number"
                    value={editingOrder?.table_number.toString() || ''}
                    onChange={handleFormChange}
                    required
                    min="1"
                    placeholder="Ex: 12"
                    className="w-full rounded-xl border-2 border-green-300 px-4 py-2 bg-green-50 focus:border-green-600 focus:ring-green-600 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-green-800 font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={editingOrder?.status || 'pending'}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border-2 border-green-300 px-4 py-2 bg-green-50 focus:border-green-600 focus:ring-green-600 text-lg"
                  >
                    <option value="pending">Pendente</option>
                    <option value="preparing">Preparando</option>
                    <option value="ready">Pronto</option>
                    <option value="delivered">Entregue</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-green-800 font-medium mb-1">Itens do Pedido</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedItems.map(item => (
                      <div key={item.menu_item_id} className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg">
                        <span>{item.name} x{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.menu_item_id, item.quantity - 1)}
                          className="text-green-700 hover:text-green-900 px-1"
                        >-</button>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.menu_item_id, item.quantity + 1)}
                          className="text-green-700 hover:text-green-900 px-1"
                        >+</button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.menu_item_id)}
                          className="text-red-600 hover:text-red-800 px-1 ml-1"
                        >×</button>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {menuItems.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleAddItem(item)}
                        disabled={!item.is_available}
                        className={`p-2 rounded-lg border-2 text-left font-medium transition-all duration-200 ${
                          item.is_available
                            ? 'border-green-300 hover:border-green-600 hover:bg-green-50'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div>{item.name}</div>
                        <div className="text-xs text-green-700">R$ {Number(item.price).toFixed(2)}</div>
                        {!item.is_available && <span className="text-xs text-red-600">Indisponível</span>}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-green-800 font-semibold text-lg">Total: R$ {total.toFixed(2)}</span>
                  <button
                    type="submit"
                    disabled={isSubmitting || selectedItems.length === 0}
                    className={`px-6 py-2 rounded-xl font-semibold shadow transition text-white ${
                      isSubmitting || selectedItems.length === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-green-700 hover:bg-green-800'
                    }`}
                  >
                    {isSubmitting ? (editingOrder ? 'Salvando...' : 'Criando...') : (editingOrder ? 'Salvar Alterações' : 'Criar Pedido')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative"
            >
              <h2 className="text-xl font-bold text-green-800 mb-4">Confirmar Exclusão</h2>
              <p className="mb-6 text-gray-700">Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-xl border border-green-300 text-green-700 hover:bg-green-50"
                  disabled={deleteLoading}
                >Cancelar</button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow"
                  disabled={deleteLoading}
                >{deleteLoading ? 'Excluindo...' : 'Excluir'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 