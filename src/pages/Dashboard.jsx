import { AlertCircle } from 'lucide-react';
import { Card, MetricCard } from '../components/ui';
import { formatCurrency, getTotalStock } from '../utils';

/**
 * Dashboard page component - Main overview with KPIs
 */
const Dashboard = ({
  totalStockValue,
  pendingOrdersCount,
  lowStockCount,
  lowStockItems,
  normalStockItems
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Stock Value"
          value={formatCurrency(totalStockValue)}
          trend="+12%"
          subtext="vs last month"
          trendUp={true}
        />
        <MetricCard
          title="Pending Orders"
          value={pendingOrdersCount}
          trend="-5%"
          subtext="processing faster"
          trendUp={true}
        />
        <MetricCard
          title="Low Stock SKUs"
          value={lowStockCount}
          trend="+2"
          subtext="needs attention"
          trendUp={false}
        />
        <MetricCard
          title="Gross Margin (Avg)"
          value="68%"
          trend="+1.2%"
          subtext="healthy"
          trendUp={true}
        />
      </div>

      {/* Charts and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Recent Sales Velocity</h3>
            <select className="text-sm border-slate-200 rounded-md text-slate-500">
              <option>Last 7 Days</option>
            </select>
          </div>
          {/* Simulated Chart */}
          <div className="h-64 flex items-end space-x-2">
            {[45, 60, 35, 70, 85, 60, 75].map((h, i) => (
              <div key={i} className="flex-1 bg-slate-100 rounded-t-lg relative group">
                <div
                  className="absolute bottom-0 w-full bg-slate-800 rounded-t-lg transition-all duration-500 hover:bg-indigo-600"
                  style={{ height: `${h}%` }}
                ></div>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded">
                  ${h * 100}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </Card>

        {/* Stock Alerts */}
        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-4">Stock Alerts</h3>
          <div className="space-y-4">
            {/* Low Stock Alerts */}
            {lowStockItems.map(item => (
              <div
                key={item.id}
                className="flex items-start p-3 bg-red-50 rounded-lg border border-red-100"
              >
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">{item.name}</p>
                  <p className="text-xs text-red-700 mt-1">
                    Only {getTotalStock(item)} units left (Safety: {item.safetyStock})
                  </p>
                  <button className="mt-2 text-xs font-medium text-red-600 hover:text-red-800">
                    Create PO &rarr;
                  </button>
                </div>
              </div>
            ))}

            {/* Normal Stock Items */}
            {normalStockItems.slice(0, 2).map(item => (
              <div
                key={item.id}
                className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {getTotalStock(item)} Units Available
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
