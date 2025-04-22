import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
}

const categoryLabels: Record<string, string> = {
  entrada: 'Entrada',
  principal: 'Prato Principal',
  sobremesa: 'Sobremesa',
  bebida: 'Bebida',
};

export function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(item.price));

  return (
    <Card className="overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-green-900">{item.name}</h3>
          <span className="text-lg font-bold text-green-600">
            {formattedPrice}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {categoryLabels[item.category] || item.category}
          </span>

          <div className="flex gap-2">
            <Button
              onClick={onEdit}
              size="sm"
              variant="outline"
            >
              Editar
            </Button>
            <Button
              onClick={onDelete}
              size="sm"
              variant="outline"
              className="text-rose-600 hover:text-rose-700 border-rose-200 hover:border-rose-300"
            >
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}