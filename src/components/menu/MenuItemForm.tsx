import { MenuItemFormData } from '../../types';

interface MenuItemFormProps {
  onSubmit: (e: React.FormEvent) => void;
  formData: MenuItemFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isEditing?: boolean;
}

export default function MenuItemForm({ onSubmit, formData, onChange, isEditing = false }: MenuItemFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-green-700">Nome do Item</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className="w-full rounded-lg border border-green-200 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors px-4 py-2.5"
            required
            placeholder="Digite o nome do item"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-green-700">Categoria</label>
          <select
            name="category"
            value={formData.category}
            onChange={onChange}
            className="w-full rounded-lg border border-green-200 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors px-4 py-2.5"
            required
          >
            <option value="">Selecione uma categoria</option>
            <option value="appetizer">Entradas</option>
            <option value="main">Pratos Principais</option>
            <option value="dessert">Sobremesas</option>
            <option value="beverage">Bebidas</option>
            <option value="snack">Lanches</option>
            <option value="salad">Saladas</option>
          </select>
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-green-700">Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            className="w-full rounded-lg border border-green-200 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors px-4 py-2.5 h-24 resize-none"
            placeholder="Digite a descrição do item"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-green-700">Preço</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600">R$</span>
            <input
              type="number"
              name="price"
              step="0.01"
              value={formData.price}
              onChange={onChange}
              className="w-full rounded-lg border border-green-200 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors pl-8 pr-4 py-2.5"
              required
              placeholder="0,00"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-green-700">Disponibilidade</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={onChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
            />
            <span className="text-sm text-green-600">Item disponível</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all transform hover:scale-105 font-medium text-sm shadow-md hover:shadow-lg"
        >
          {isEditing ? 'Atualizar Item' : 'Adicionar ao Cardápio'}
        </button>
      </div>
    </form>
  );
} 