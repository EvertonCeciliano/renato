import React from 'react';

interface MenuItemCardProps {
  name: string;
  description: string;
  price: number;
  category?: string;
  isAvailable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleAvailability?: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  name,
  description,
  price,
  category,
  isAvailable = true,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="relative bg-white rounded-xl p-4 hover:shadow-md transition-all duration-300">
      {/* Status Tag */}
      <div 
        className={`absolute -top-2 right-3 px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
          isAvailable 
            ? 'bg-emerald-500 text-white' 
            : 'bg-red-500 text-white'
        }`}
      >
        {isAvailable ? 'Disponível' : 'Indisponível'}
      </div>

      {/* Main Content */}
      <div className="space-y-3">
        {/* Title and Category */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 truncate pr-20">
            {name}
          </h3>
          {category && (
            <span className="inline-block mt-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {category}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-semibold text-emerald-600">
            {formatPrice(price)}
          </span>

          <div className="flex items-center gap-2">
            {/* Toggle Availability */}
            <button
              onClick={onToggleAvailability}
              className={`group p-2 rounded-lg transition-all duration-200 ${
                isAvailable 
                  ? 'hover:bg-emerald-50' 
                  : 'hover:bg-red-50'
              }`}
              title={isAvailable ? 'Marcar como indisponível' : 'Marcar como disponível'}
            >
              <svg 
                className={`w-5 h-5 transition-colors duration-200 ${
                  isAvailable 
                    ? 'text-emerald-500 group-hover:text-emerald-600' 
                    : 'text-red-500 group-hover:text-red-600'
                }`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isAvailable 
                    ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  }
                />
              </svg>
            </button>

            {/* Edit */}
            <button
              onClick={onEdit}
              className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              title="Editar item"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                />
              </svg>
            </button>

            {/* Delete */}
            <button
              onClick={onDelete}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              title="Excluir item"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard; 