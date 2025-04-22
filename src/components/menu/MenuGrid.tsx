import React, { useState } from 'react';
import MenuItemCard from '../common/MenuItemCard';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  isAvailable: boolean;
}

interface MenuGridProps {
  items: MenuItem[];
  onEditItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  onEditItem,
  onDeleteItem,
  onToggleAvailability,
}) => {
  const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'available' ? item.isAvailable :
      !item.isAvailable;

    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Group items by category
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    const category = item.category || 'Sem categoria';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar itens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border-2 border-gray-100 focus:border-emerald-500 focus:bg-white focus:ring-0 transition-colors"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Todos ({items.length})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'available'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Disponíveis ({items.filter(i => i.isAvailable).length})
            </button>
            <button
              onClick={() => setFilter('unavailable')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unavailable'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Indisponíveis ({items.filter(i => !i.isAvailable).length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
          <div key={category} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-medium text-gray-800">
                {category}
              </h2>
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-sm text-gray-500">
                {categoryItems.length} {categoryItems.length === 1 ? 'item' : 'itens'}
              </span>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  category={item.category}
                  isAvailable={item.isAvailable}
                  onEdit={() => onEditItem(item.id)}
                  onDelete={() => onDeleteItem(item.id)}
                  onToggleAvailability={() => onToggleAvailability(item.id)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum item encontrado
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchQuery
                ? "Não encontramos nenhum item correspondente à sua busca."
                : filter === 'available'
                ? "Não há itens disponíveis no momento."
                : filter === 'unavailable'
                ? "Não há itens indisponíveis no momento."
                : "Adicione seu primeiro item ao menu para começar."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuGrid; 