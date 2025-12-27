import { Search, Bell, Menu } from 'lucide-react';

/**
 * Header component - Top navigation bar
 */
const Header = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6">
      {/* Mobile menu button */}
      <div className="flex items-center md:hidden">
        <button onClick={onMenuClick} className="mr-4">
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      {/* Search bar - desktop only */}
      <div className="hidden md:flex flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Command + K to search..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
          <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] text-slate-400 font-medium">
            Cmd
          </span>
          <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] text-slate-400 font-medium">
            K
          </span>
        </div>
      </div>

      {/* Notifications */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
