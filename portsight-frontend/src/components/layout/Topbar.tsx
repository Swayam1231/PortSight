import { Bell, Search, Menu } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
      
      {/* Left side: Mobile menu & Search */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-500 hover:text-gray-700">
          <Menu size={24} />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search portfolio..." 
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
          />
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

    </header>
  );
}