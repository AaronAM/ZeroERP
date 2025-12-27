import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from './Card';

/**
 * MetricCard component - Dashboard KPI display card
 */
const MetricCard = ({ title, value, subtext, trend, trendUp }) => (
  <Card className="p-5">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${trendUp ? 'bg-emerald-50' : 'bg-rose-50'}`}>
        {trendUp ? (
          <ArrowUpRight className="w-5 h-5 text-emerald-600" />
        ) : (
          <ArrowDownRight className="w-5 h-5 text-rose-600" />
        )}
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs">
      <span className={`font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trend}
      </span>
      <span className="text-slate-400 ml-1">{subtext}</span>
    </div>
  </Card>
);

export default MetricCard;
