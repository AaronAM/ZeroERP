import { useState } from 'react';
import InputField from './InputField';
import { validateInventoryForm } from '../../utils';

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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = ['warehouse', 'store', 'safetyStock', 'cost', 'price'].includes(name)
      ? parseFloat(value) || 0
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate on blur
    const validationErrors = validateInventoryForm(formData);
    if (validationErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = validateInventoryForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        name: true,
        category: true,
        vendor: true,
        cost: true,
        price: true,
        warehouse: true,
        store: true,
        safetyStock: true
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Product Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && errors.name}
      />

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.category && errors.category}
        />
        <InputField
          label="Vendor"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.vendor && errors.vendor}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Cost ($)"
          name="cost"
          type="number"
          step="0.01"
          min="0"
          value={formData.cost}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.cost && errors.cost}
        />
        <InputField
          label="Price ($)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.price && errors.price}
        />
      </div>

      <div className="p-4 bg-slate-50 rounded-lg space-y-4 border border-slate-100">
        <h4 className="text-sm font-bold text-slate-700">Stock Levels</h4>
        <div className="grid grid-cols-3 gap-3">
          <InputField
            label="Warehouse"
            name="warehouse"
            type="number"
            min="0"
            value={formData.warehouse}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.warehouse && errors.warehouse}
          />
          <InputField
            label="Store"
            name="store"
            type="number"
            min="0"
            value={formData.store}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.store && errors.store}
          />
          <InputField
            label="Safety Stock"
            name="safetyStock"
            type="number"
            min="0"
            value={formData.safetyStock}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.safetyStock && errors.safetyStock}
          />
        </div>
      </div>

      {Object.keys(errors).length > 0 && touched.name && (
        <p className="text-sm text-red-600 text-center">
          Please fix the errors above before submitting.
        </p>
      )}

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
