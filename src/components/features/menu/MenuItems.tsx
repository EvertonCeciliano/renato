import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { MenuItemForm } from './MenuItemForm';
import { MenuItemCard } from './MenuItemCard';
import { api } from '../../../services/api';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export function MenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await api.get('/menu-items');
      setItems(response.data);
    } catch (err) {
      setError('Erro ao carregar itens do cardápio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (item: Omit<MenuItem, 'id'>) => {
    try {
      if (editingItem) {
        await api.put(`/menu-items/${editingItem.id}`, item);
      } else {
        await api.post('/menu-items', item);
      }
      await loadItems();
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (err) {
      setError('Erro ao salvar item');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/menu-items/${id}`);
      await loadItems();
    } catch (err) {
      setError('Erro ao excluir item');
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
        <h1 className="text-3xl font-bold text-green-900">Cardápio</h1>
        <Button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
        >
          Adicionar Item
        </Button>
      </div>

      {error && (
        <Card className="mb-8 bg-rose-50 border-rose-200" variant="solid">
          <div className="p-4 text-rose-700">{error}</div>
        </Card>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-900">
                  {editingItem ? 'Editar Item' : 'Novo Item'}
                </h2>
                <button
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingItem(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <MenuItemForm
                onSubmit={handleSave}
                initialData={editingItem || undefined}
              />
            </div>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>
    </div>
  );
} 