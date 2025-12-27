/**
 * Badge component - Status indicator with color-coded styling
 */

const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Ordered: "bg-purple-100 text-purple-700",
  Received: "bg-slate-100 text-slate-700",
  Low: "bg-red-100 text-red-700",
  Normal: "bg-emerald-100 text-emerald-700",
};

const Badge = ({ status }) => {
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-800";

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
};

export default Badge;
