import { Plus, Truck, DollarSign, CheckCircle } from 'lucide-react';
import { Card, Badge } from '../components/ui';

/**
 * Purchasing page component - Purchase order management
 */
const Purchasing = ({ purchaseOrders, onReceivePO }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Purchase Orders</h2>
        <button className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" /> New PO
        </button>
      </div>

      {/* PO Cards */}
      <div className="grid gap-6">
        {purchaseOrders.map((po) => (
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
    </div>
  );
};

export default Purchasing;
