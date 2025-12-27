/**
 * InputField component - Reusable form input with label and error display
 */
const InputField = ({ label, name, type = "text", step, value, onChange, onBlur, required = true, error, min }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type}
      name={name}
      step={step}
      min={min}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent ${
        error ? 'border-red-300 bg-red-50' : 'border-slate-200'
      }`}
      required={required}
    />
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
  </div>
);

export default InputField;
