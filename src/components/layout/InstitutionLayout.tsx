import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Wheat, LogOut, GraduationCap } from 'lucide-react';
import { sessionService } from '../../auth/session';

const InstitutionLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionService.logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/institution/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/institution/producers', label: 'Üreticiler', icon: Users },
    { path: '/institution/opportunities', label: 'Fırsatlar', icon: GraduationCap },
  ];

  return (
    <div className="flex h-screen bg-fin-50 print:bg-white print:h-auto">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col print:hidden">
        <Link to="/" className="h-16 flex items-center px-6 border-b border-slate-200 hover:bg-slate-50 transition-colors">
          <Wheat className="h-8 w-8 text-agri-600 mr-2" />
          <span className="text-xl font-bold text-fin-900">AgriScore AI</span>
        </Link>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-agri-50 text-agri-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-fin-900'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-fin-900 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto print:overflow-visible">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 print:hidden">
          <h1 className="text-lg font-medium text-fin-900">
            Finansal Karar Destek Paneli
          </h1>
          <div className="flex items-center space-x-4">
             <div className="text-sm text-slate-500">
               Demo Kurum: Örnek Tarımsal Finans Kurumu
             </div>
             <div className="h-8 w-8 rounded-full bg-agri-100 flex items-center justify-center text-agri-700 font-bold">
               TB
             </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto print:p-0 print:max-w-none">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default InstitutionLayout;
