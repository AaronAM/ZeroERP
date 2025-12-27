/**
 * Skeleton component - Loading placeholder with animation
 */
const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const baseClasses = 'animate-pulse bg-slate-200';

  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

/**
 * TableSkeleton - Loading skeleton for table rows
 */
export const TableSkeleton = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center px-6 py-4 gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={`h-4 ${colIndex === 0 ? 'w-32' : 'w-20'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * CardSkeleton - Loading skeleton for cards
 */
export const CardSkeleton = () => {
  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
};

export default Skeleton;
