/**
 * InputField component - Reusable form input with label
 */
const InputField = ({ label, name, type = "text", step, value, onChange, required = true }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type}
      name={name}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
      required={required}
    />
  </div>
);

export default InputField;
