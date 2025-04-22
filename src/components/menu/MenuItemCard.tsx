import { MenuItem } from '../../types';

interface MenuItemCardProps extends MenuItem {
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
}

export default function MenuItemCard({
  id,
  name,
  description,
  price,
  category,
  is_available,
  onEdit,
  onDelete
}: MenuItemCardProps) {
  const categoryIcons = {
    appetizer: '🥗',
    main: '🍽️',
    dessert: '🍰',
    beverage: '🥤',
    snack: '🍔',
    salad: '🥬'
  };

  const categoryLabels = {
    appetizer: 'Entrada',
    main: 'Prato Principal',
    dessert: 'Sobremesa',
    beverage: 'Bebida',
    snack: 'Lanche',
    salad: 'Salada'
  };

  // Convert price to number and format it
  const formattedPrice = typeof price === 'string' 
    ? parseFloat(price).toFixed(2)
    : price.toFixed(2);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-green-100">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-green-800 mb-1">{name}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
              {categoryIcons[category as keyof typeof categoryIcons]} {categoryLabels[category as keyof typeof categoryLabels]}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit({ id, name, description, price, category, is_available })}
              className="p-2 text-green-600 hover:text-green-700 rounded-full hover:bg-green-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-2 text-rose-500 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-green-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-green-700">
            R$ {formattedPrice}
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            is_available
              ? 'bg-green-50 text-green-700 border border-green-100'
              : 'bg-rose-50 text-rose-700 border border-rose-100'
          }`}>
            {is_available ? 'Disponível' : 'Indisponível'}
          </span>
        </div>
      </div>
    </div>
  );
} 