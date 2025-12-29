import { ShoppingCart, TrendingUp } from 'lucide-react';
import { Card } from '../ui';

/**
 * SmartReplenishment component - AI-lite suggestion engine for inventory replenishment
 * Calculates optimal order quantities based on safety stock levels
 */
export const SmartReplenishment = ({ lowStockItems, onAutoOrder }) => {
  // Simple "AI" logic: Suggest order qty = (Safety Stock * 2) - Current Stock
  const recommendations = lowStockItems.map(item => {
    const currentStock = item.stock.warehouse + item.stock.store;
    return {
      ...item,
      currentStock,
      suggestedQty: Math.max(0, (item.safetyStock * 2) - currentStock),
      reason: item.stock.warehouse === 0 ? 'Stockout Risk' : 'Below Safety Level'
    };
  });

  if (recommendations.length === 0) return null;

  return (
    <Card className="col-span-1 lg:col-span-3 border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Smart Replenishment
          </h3>
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
            AI Insights
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map(item => (
            <div key={item.id} className="group bg-white p-4 rounded-xl border border-indigo-50 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500">{item.vendor}</p>
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wide">
                  {item.reason}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-slate-500">
                  Current: <span className="font-mono font-medium text-slate-700">{item.currentStock}</span>
                </div>
                <button
                  onClick={() => onAutoOrder(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  <ShoppingCart className="w-3 h-3" />
                  Order {item.suggestedQty}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SmartReplenishment;
