/**
 * Placeholder page component - For unimplemented pages
 */
const Placeholder = ({ title = "Module" }) => {
  return (
    <div className="p-10 text-center text-slate-400 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-600 mb-2">{title}</h2>
      <p>This module is under construction</p>
    </div>
  );
};

export default Placeholder;
