import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, ShieldAlert, TrendingUp, History, Activity } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Risk Overview', path: '/risks', icon: ShieldAlert },
    { name: 'Optimization', path: '/ranking', icon: TrendingUp },
    { name: 'Decision Log', path: '/decisions', icon: History },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col hidden md:flex">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 bg-slate-950 text-white font-bold text-xl gap-2 tracking-wide">
        <Activity className="text-blue-500" />
        PortSight
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User Mini Profile */}
      <div className="p-4 border-t border-slate-800 mx-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="text-sm">
            <p className="text-white font-semibold">Admin User</p>
            <p className="text-slate-500 text-xs">Portfolio Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}