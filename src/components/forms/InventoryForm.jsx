import { useState } from 'react';
import InputField from './InputField';

/**
 * InventoryForm component - Form for adding/editing inventory items
 */
const InventoryForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    category: initialData.category || '',
    warehouse: initialData.stock?.warehouse || 0,
    store: initialData.stock?.store || 0,
    safetyStock: initialData.safetyStock || 0,
    cost: initialData.cost || 0,
    price: initialData.price || 0,
    vendor: initialData.vendor || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['warehouse', 'store', 'safetyStock', 'cost', 'price'].includes(name)
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Product Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
        <InputField
          label="Vendor"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Cost ($)"
          name="cost"
          type="number"
          step="0.01"
          value={formData.cost}
          onChange={handleChange}
        />
        <InputField
          label="Price ($)"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
        />
      </div>

      <div className="p-4 bg-slate-50 rounded-lg space-y-4 border border-slate-100">
        <h4 className="text-sm font-bold text-slate-700">Stock Levels</h4>
        <div className="grid grid-cols-3 gap-3">
          <InputField
            label="Warehouse"
            name="warehouse"
            type="number"
            value={formData.warehouse}
            onChange={handleChange}
          />
          <InputField
            label="Store"
            name="store"
            type="number"
            value={formData.store}
            onChange={handleChange}
          />
          <InputField
            label="Safety Stock"
            name="safetyStock"
            type="number"
            value={formData.safetyStock}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;
