import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  TrendingUp, 
  AlertTriangle,
  FileText,
  Grid3x3
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Portfolio Dashboard' },
    { path: '/ranking', icon: TrendingUp, label: 'Project Ranking' },
    { path: '/risks', icon: AlertTriangle, label: 'Risk Overview' },
    { path: '/decisions', icon: FileText, label: 'Decision Log' },
    { path: '/projects', icon: FolderKanban, label: 'Projects' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="h-screen w-64 bg-[#1a1d2e] text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Grid3x3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Portfolio DSS</h1>
            <p className="text-xs text-gray-400">Decision Support</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive(item.path)
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-800/50'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
