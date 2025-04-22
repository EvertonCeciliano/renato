import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { api } from '../../../services/api';

interface Order {
  id: string;
  table: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  createdAt: string;
}

const statusLabels: Record<Order['status'], string> = {
  pending: 'Pendente',
  preparing: 'Preparando',
  ready: 'Pronto',
  delivered: 'Entregue',
};

const statusColors: Record<Order['status'], { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  preparing: { bg: 'bg-blue-100', text: 'text-blue-800' },
  ready: { bg: 'bg-green-100', text: 'text-green-800' },
  delivered: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Erro ao carregar pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await api.patch(`/orders/${orderId}`, { status: newStatus });
      await loadOrders();
    } catch (err) {
      setError('Erro ao atualizar status do pedido');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-900">Pedidos</h1>
      </div>

      {error && (
        <Card className="mb-8 bg-rose-50 border-rose-200" variant="solid">
          <div className="p-4 text-rose-700">{error}</div>
        </Card>
      )}

      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-1">
                    Mesa {order.table}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[order.status].bg
                  } ${statusColors[order.status].text}`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <span className="text-green-600 font-medium mr-2">
                        {item.quantity}x
                      </span>
                      <span className="text-gray-900">{item.name}</span>
                    </div>
                    <span className="text-gray-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-green-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2 justify-end">
                {order.status === 'pending' && (
                  <Button
                    onClick={() => handleUpdateStatus(order.id, 'preparing')}
                    size="sm"
                  >
                    Iniciar Preparo
                  </Button>
                )}
                {order.status === 'preparing' && (
                  <Button
                    onClick={() => handleUpdateStatus(order.id, 'ready')}
                    size="sm"
                  >
                    Marcar como Pronto
                  </Button>
                )}
                {order.status === 'ready' && (
                  <Button
                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                    size="sm"
                  >
                    Confirmar Entrega
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 