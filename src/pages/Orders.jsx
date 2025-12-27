import { useState } from 'react';
import { Download, Search, Filter } from 'lucide-react';
import { Card, Badge, EmptyState } from '../components/ui';

/**
 * Orders page component - Sales order management
 */
const Orders = ({ orders, onFulfillOrder, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || order.channel === channelFilter;
    return matchesSearch && matchesStatus && matchesChannel;
  });

  // Get unique channels from orders
  const channels = [...new Set(orders.map(o => o.channel))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-900">All Orders</h2>
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        {/* Search and Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders or customers..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                showFilters ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" /> Filters
            </button>
          </div>

          {/* Filter dropdowns */}
          {showFilters && (
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-500">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="all">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-500">Channel:</label>
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="all">All</option>
                  {channels.map(channel => (
                    <option key={channel} value={channel}>{channel}</option>
                  ))}
                </select>
              </div>
              {(statusFilter !== 'all' || channelFilter !== 'all') && (
                <button
                  onClick={() => { setStatusFilter('all'); setChannelFilter('all'); }}
                  className="text-xs text-slate-500 hover:text-slate-900 underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <EmptyState
            title="No orders found"
            description={searchTerm || statusFilter !== 'all' || channelFilter !== 'all'
              ? "Try adjusting your search or filters"
              : "Orders will appear here when they are placed"}
          />
        ) : (
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
              {filteredOrders.map((order) => (
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
        )}
      </Card>
    </div>
  );
};

export default Orders;
