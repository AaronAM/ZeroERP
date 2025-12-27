import { useState } from 'react';
import { Plus, Truck, DollarSign, CheckCircle, Download, Search, Filter } from 'lucide-react';
import { Card, Badge, EmptyState } from '../components/ui';

/**
 * Purchasing page component - Purchase order management
 */
const Purchasing = ({ purchaseOrders, onReceivePO, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter purchase orders
  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch =
      po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-900">Purchase Orders</h2>
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" /> New PO
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search PO ID or vendor..."
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
          <div className="flex flex-wrap gap-4 pt-4 mt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="all">All</option>
                <option value="Ordered">Ordered</option>
                <option value="Received">Received</option>
              </select>
            </div>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="text-xs text-slate-500 hover:text-slate-900 underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </Card>

      {/* PO Cards */}
      {filteredPOs.length === 0 ? (
        <Card className="p-0">
          <EmptyState
            icon={Truck}
            title="No purchase orders found"
            description={searchTerm || statusFilter !== 'all'
              ? "Try adjusting your search or filters"
              : "Create a new purchase order to get started"}
          />
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredPOs.map((po) => (
            <Card key={po.id} className="p-0 overflow-hidden flex flex-col md:flex-row">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-slate-900">{po.id}</h3>
                      <Badge status={po.status} />
                    </div>
                    <p className="text-slate-500 text-sm mt-1">
                      Vendor: <span className="font-medium text-slate-700">{po.vendor}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-lg">${po.total.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">Total Value</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span>Expected: {po.expected}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Payment: Net 30</span>
                  </div>
                </div>
              </div>
              {po.status !== 'Received' && (
                <div className="bg-slate-50 p-6 flex items-center border-t md:border-t-0 md:border-l border-slate-100">
                  <button
                    onClick={() => onReceivePO(po.id)}
                    className="w-full md:w-auto flex items-center justify-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Receive Goods
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Purchasing;
