import { useState, useEffect } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { CommandPalette } from '../dashboard';

/**
 * Header component - Top navigation bar with Command Palette support
 */
const Header = ({ onMenuClick, onNavigate, onAction }) => {
  const [showPalette, setShowPalette] = useState(false);

  // Global keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowPalette(open => !open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchClick = () => {
    setShowPalette(true);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6">
        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button onClick={onMenuClick} className="mr-4">
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Search bar - desktop only */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <button
            onClick={handleSearchClick}
            className="w-full flex items-center pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400 hover:border-slate-300 hover:bg-slate-100 transition-all text-left"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <span>Search or jump to...</span>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] text-slate-400 font-medium">
                Cmd
              </span>
              <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] text-slate-400 font-medium">
                K
              </span>
            </div>
          </button>
        </div>

        {/* Mobile search button */}
        <button
          onClick={handleSearchClick}
          className="md:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={showPalette}
        onClose={() => setShowPalette(false)}
        onNavigate={(target) => {
          onNavigate?.(target);
          setShowPalette(false);
        }}
        onAction={onAction}
      />
    </>
  );
};

export default Header;
