import { Package } from 'lucide-react';

/**
 * EmptyState component - Display when no data is available
 */
const EmptyState = ({
  icon: Icon = Package,
  title = 'No items found',
  description = 'There are no items to display.',
  action
}) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
