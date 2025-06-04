import { useState, useEffect } from 'react';
import axios from 'axios';
import { MenuItem, MenuItemFormData } from '../types';
import MenuItemForm from './menu/MenuItemForm';
import MenuItemCard from './menu/MenuItemCard';

const API_URL = import.meta.env.VITE_API_URL;
const REFRESH_INTERVAL = 5000; // 5 seconds

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState<MenuItemFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    is_available: true
  });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchMenuItems();
    const intervalId = setInterval(fetchMenuItems, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/menu-items`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Erro ao carregar os itens do cardápio. Por favor, tente novamente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemToSubmit = editingItem ? {
        ...editingItem,
        price: parseFloat(editingItem.price.toString())
      } : {
        ...newItem,
        price: parseFloat(newItem.price)
      };

      const response = editingItem
        ? await axios.put(`${API_URL}/api/menu-items/${editingItem.id}`, itemToSubmit)
        : await axios.post(`${API_URL}/api/menu-items`, itemToSubmit);
      
      if (response.status === 200 || response.status === 201) {
        await fetchMenuItems();
        setNewItem({
          name: '',
          description: '',
          price: '',
          category: '',
          is_available: true
        });
        setEditingItem(null);
        setIsFormVisible(false);
        setSuccess(editingItem ? 'Item atualizado com sucesso!' : 'Item adicionado com sucesso!');
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      setError('Erro ao salvar o item. Por favor, tente novamente.');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      is_available: item.is_available
    });
    setIsFormVisible(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    
    try {
      const response = await axios.delete(`${API_URL}/api/menu-items/${id}`);
      
      if (response.status === 200) {
        await fetchMenuItems();
        setSuccess('Item excluído com sucesso!');
      }
    } catch (error: any) {
      console.error('Error deleting menu item:', error);
      if (error.response?.status === 409) {
        setError(error.response.data.error);
      } else if (error.response?.status === 400) {
        setError(error.response.data.error);
      } else if (error.response?.status === 404) {
        setError('Item não encontrado. Pode ter sido excluído.');
        await fetchMenuItems();
      } else {
        setError('Erro ao excluir o item. Por favor, tente novamente.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | MenuItemFormData) => {
    if ('target' in e) {
      const { name, value, type } = e.target;
      const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      if (editingItem) {
        setEditingItem(prev => ({
          ...prev!,
          [name]: name === 'price' ? parseFloat(value) || 0 : newValue
        }));
      } else {
        setNewItem(prev => ({
          ...prev,
          [name]: newValue
        }));
      }
    } else {
      if (editingItem) {
        setEditingItem(prev => ({
          ...prev!,
          ...e,
          price: typeof e.price === 'string' ? parseFloat(e.price) || 0 : e.price
        }));
      } else {
        setNewItem(e);
      }
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const categories = ['all', 'appetizer', 'main', 'dessert', 'beverage', 'snack', 'salad'];
  const categoryLabels = {
    all: 'Todos',
    appetizer: 'Entradas',
    main: 'Pratos Principais',
    dessert: 'Sobremesas',
    beverage: 'Bebidas',
    snack: 'Lanches',
    salad: 'Saladas'
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-900">Cardápio</h1>
        <button
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            if (isFormVisible) {
              setEditingItem(null);
              setNewItem({
                name: '',
                description: '',
                price: '',
                category: '',
                is_available: true
              });
            }
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {isFormVisible ? 'Cancelar' : 'Adicionar Item'}
        </button>
      </div>

      {isFormVisible && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-green-100">
          <h2 className="text-lg font-semibold text-green-900 mb-4">
            {editingItem ? 'Editar Item' : 'Novo Item'}
          </h2>
          <MenuItemForm
            onSubmit={handleSubmit}
            formData={editingItem ? {
              ...editingItem,
              price: editingItem.price.toString()
            } : newItem}
            onChange={handleChange}
            isEditing={!!editingItem}
          />
        </div>
      )}

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
            }`}
          >
            {categoryLabels[category as keyof typeof categoryLabels]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <MenuItemCard
            key={item.id}
            {...item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
} 