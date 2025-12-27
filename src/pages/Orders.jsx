import { Card, Badge } from '../components/ui';

/**
 * Orders page component - Sales order management
 */
const Orders = ({ orders, onFulfillOrder }) => {
  const getChannelColor = (channel) => {
    switch (channel) {
      case 'Shopify':
        return 'bg-green-500';
      case 'Amazon':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">All Orders</h2>
        <div className="text-sm text-slate-500">Syncing with Shopify & Amazon...</div>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-mono font-medium text-slate-900">
                  {order.id}
                </td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getChannelColor(order.channel)}`}></span>
                    {order.channel}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{order.date}</td>
                <td className="px-6 py-4 text-right font-medium">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <Badge status={order.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  {order.status === 'Pending' && (
                    <button
                      onClick={() => onFulfillOrder(order.id)}
                      className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors"
                    >
                      Ship
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Orders;
