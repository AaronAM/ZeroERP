import { Search, Filter, Download, Plus } from 'lucide-react';
import { Card, Badge, Modal } from '../components/ui';
import { InventoryForm } from '../components/forms';
import { calculateMargin, getTotalStock } from '../utils';

/**
 * Inventory page component - SKU management
 */
const Inventory = ({
  filteredInventory,
  searchTerm,
  onSearchChange,
  onExport,
  isAddModalOpen,
  onOpenAddModal,
  onCloseAddModal,
  editingItem,
  onEditItem,
  onCloseEditModal,
  onInventorySubmit
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-900">Inventory Management</h2>
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
          >
            <Plus className="w-4 h-4 mr-2" /> Add SKU
          </button>
        </div>
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden">
        {/* Search and Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search SKUs, names, or categories..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button className="flex items-center px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Product / SKU</th>
                <th className="px-6 py-4">Location Split</th>
                <th className="px-6 py-4 text-right">Cost</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">Margin</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => {
                const total = getTotalStock(item);
                const margin = calculateMargin(item.price, item.cost);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{item.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex justify-between w-32">
                          <span className="text-slate-500">Warehouse:</span>
                          <span className="font-mono">{item.stock.warehouse}</span>
                        </span>
                        <span className="flex justify-between w-32">
                          <span className="text-slate-500">Store:</span>
                          <span className="font-mono">{item.stock.store}</span>
                        </span>
                        <div className="w-32 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-slate-900"
                            style={{ width: `${Math.min((total / (item.safetyStock * 3)) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-600">
                      ${item.cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-900">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          margin > 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {margin}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={total < item.safetyStock ? 'Low' : 'Normal'} />
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400">
                      <button
                        onClick={() => onEditItem(item)}
                        className="hover:text-slate-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add SKU Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        title="Add New SKU"
      >
        <InventoryForm
          onSubmit={onInventorySubmit}
          onCancel={onCloseAddModal}
        />
      </Modal>

      {/* Edit SKU Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={onCloseEditModal}
        title="Edit SKU"
      >
        {editingItem && (
          <InventoryForm
            initialData={editingItem}
            onSubmit={onInventorySubmit}
            onCancel={onCloseEditModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default Inventory;
