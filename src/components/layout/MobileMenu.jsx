import { X } from 'lucide-react';
import Navigation from './Navigation';

/**
 * MobileMenu component - Overlay menu for mobile devices
 */
const MobileMenu = ({ isOpen, onClose, activeTab, onNavigate, pendingOrdersCount }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 md:hidden"
      onClick={onClose}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-64 bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-lg">ZeroERP</span>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <Navigation
          activeTab={activeTab}
          onNavigate={onNavigate}
          pendingOrdersCount={pendingOrdersCount}
        />
      </div>
    </div>
  );
};

export default MobileMenu;
