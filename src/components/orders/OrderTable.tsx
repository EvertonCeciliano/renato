import { Order } from '../../types';

interface OrderTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: number) => void;
}

export default function OrderTable({ orders, onEdit, onDelete }: OrderTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-green-200">
        <thead className="bg-green-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
              Table
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
              Total Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
              Items
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-green-800 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-green-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-green-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                {order.table_number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'ready' ? 'bg-green-100 text-green-800' :
                  order.status === 'delivered' ? 'bg-gray-100 text-gray-700' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                ${typeof order.total_amount === 'number' ? order.total_amount.toFixed(2) : parseFloat(order.total_amount).toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-green-800">
                <ul className="list-disc list-inside">
                  {order.items?.map((item, index) => (
                    <li key={index}>{item.name} (x{item.quantity})</li>
                  )) || <li>No items</li>}
                </ul>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(order)}
                  className="text-green-700 hover:text-green-900 hover:bg-green-50 px-3 py-1 rounded-md transition-colors duration-200 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(order.id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-md transition-colors duration-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 