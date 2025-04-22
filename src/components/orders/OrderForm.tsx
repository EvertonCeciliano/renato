import { OrderFormData } from '../../types';

interface OrderFormProps {
  onSubmit: (e: React.FormEvent) => void;
  formData: OrderFormData;
  onChange: (data: OrderFormData) => void;
}

export default function OrderForm({ onSubmit, formData, onChange }: OrderFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-green-700">
            Table Number
          </label>
          <input
            type="number"
            value={formData.table_number}
            onChange={(e) => onChange({ ...formData, table_number: e.target.value })}
            className="w-full rounded-xl border-2 border-green-200 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors px-4 py-3"
            required
            placeholder="Enter table number"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-green-700">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => onChange({ ...formData, status: e.target.value })}
            className="w-full rounded-xl border-2 border-green-200 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors px-4 py-3"
            required
          >
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-green-700">
            Total Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 font-medium">$</span>
            <input
              type="number"
              step="0.01"
              value={formData.total_amount}
              onChange={(e) => onChange({ ...formData, total_amount: e.target.value })}
              className="w-full rounded-xl border-2 border-green-200 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors pl-8 pr-4 py-3"
              required
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all transform hover:scale-105 font-semibold text-sm shadow-lg hover:shadow-xl"
        >
          Create Order
        </button>
      </div>
    </form>
  );
} 