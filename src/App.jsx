import { Sidebar, Header, MobileMenu } from './components/layout';
import { Dashboard, Inventory, Orders, Purchasing, Placeholder } from './pages';
import { useNavigation, useInventory, useOrders, usePurchaseOrders } from './hooks';
import { exportInventoryToCSV } from './utils';

/**
 * Main Application Component
 * Orchestrates all pages and manages global state
 */
function App() {
  // Navigation state
  const {
    activeTab,
    isMobileMenuOpen,
    navigate,
    openMobileMenu,
    closeMobileMenu
  } = useNavigation();

  // Inventory state
  const {
    inventory,
    searchTerm,
    isAddModalOpen,
    editingItem,
    totalStockValue,
    lowStockCount,
    lowStockItems,
    normalStockItems,
    filteredInventory,
    setSearchTerm,
    handleInventorySubmit,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
  } = useInventory();

  // Orders state
  const {
    orders,
    pendingOrdersCount,
    fulfillOrder
  } = useOrders();

  // Purchase orders state
  const {
    purchaseOrders,
    receivePO
  } = usePurchaseOrders();

  // Handle export
  const handleExport = () => {
    exportInventoryToCSV(inventory);
  };

  // Handle order fulfillment with notification
  const handleFulfillOrder = (orderId) => {
    fulfillOrder(orderId);
    alert(`Order ${orderId} marked as Shipped. (Simulation: Inventory would be adjusted here)`);
  };

  // Handle PO receipt with notification
  const handleReceivePO = (poId) => {
    receivePO(poId);
    alert(`PO ${poId} received. (Simulation: Stock levels would be updated here)`);
  };

  // Handle inventory form submission with notification
  const handleInventoryFormSubmit = (data) => {
    const result = handleInventorySubmit(data);
    if (result.action === 'updated') {
      alert(`SKU ${result.id} updated successfully.`);
    } else {
      alert(`New SKU ${result.id} added successfully.`);
    }
    closeAddModal();
    closeEditModal();
  };

  // Render active page content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            totalStockValue={totalStockValue}
            pendingOrdersCount={pendingOrdersCount}
            lowStockCount={lowStockCount}
            lowStockItems={lowStockItems}
            normalStockItems={normalStockItems}
          />
        );

      case 'inventory':
        return (
          <Inventory
            filteredInventory={filteredInventory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onExport={handleExport}
            isAddModalOpen={isAddModalOpen}
            onOpenAddModal={openAddModal}
            onCloseAddModal={closeAddModal}
            editingItem={editingItem}
            onEditItem={openEditModal}
            onCloseEditModal={closeEditModal}
            onInventorySubmit={handleInventoryFormSubmit}
          />
        );

      case 'orders':
        return (
          <Orders
            orders={orders}
            onFulfillOrder={handleFulfillOrder}
          />
        );

      case 'purchasing':
        return (
          <Purchasing
            purchaseOrders={purchaseOrders}
            onReceivePO={handleReceivePO}
          />
        );

      case 'reports':
        return <Placeholder title="Reports" />;

      case 'settings':
        return <Placeholder title="Settings" />;

      default:
        return <Placeholder title="Page Not Found" />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={navigate}
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        activeTab={activeTab}
        onNavigate={navigate}
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Header onMenuClick={openMobileMenu} />

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
