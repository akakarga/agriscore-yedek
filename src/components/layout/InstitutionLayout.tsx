import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { LayoutDashboard, Users, Wheat, LogOut, GraduationCap, FileText, Menu, X, BrainCircuit } from 'lucide-react';
import { sessionService } from '../../auth/session';

const InstitutionLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionService.logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/institution/dashboard', label: 'Portföy Özeti', icon: LayoutDashboard },
    { path: '/institution/producers', label: 'Üreticiler', icon: Users },
    { path: '/institution/decision-room', label: 'Risk ve Analiz', icon: BrainCircuit },
    { path: '/institution/opportunities', label: 'Fırsatlar', icon: GraduationCap },
    { path: '/institution/cks-analiz', label: 'ÇKS Belgesi', icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-fin-50 print:bg-white print:h-auto">
      {isMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-slate-950/40 z-40 md:hidden print:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Menüyü kapat"
        />
      )}

      {/* Sidebar */}
      <aside className={`tour-sidebar fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col print:hidden z-50 transition-transform duration-200 md:translate-x-0 ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center px-4 border-b border-slate-200">
          <Link to="/" className="flex items-center min-w-0 px-2 hover:opacity-80 transition-opacity">
            <Wheat className="h-8 w-8 text-agri-600 mr-2 flex-shrink-0" />
            <span className="text-xl font-bold text-fin-900">AgriScore</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="ml-auto p-1 text-slate-500 md:hidden"
            aria-label="Menüyü kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors tour-menu-${item.path.split('/').pop()} ${
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
      <main className="flex-1 min-w-0 md:ml-64 print:ml-0 flex flex-col min-h-screen overflow-x-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 print:hidden sticky top-0 z-30">
          <div className="flex items-center min-w-0">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="mr-3 p-2 -ml-2 text-slate-600 md:hidden"
              aria-label="Navigasyon menüsünü aç"
            >
              <Menu className="w-6 h-6" />
            </button>
          <h1 className="text-base md:text-lg font-medium text-fin-900 truncate">
            Kurumsal Çalışma Alanı
          </h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden lg:block text-right">
               <div className="text-sm text-slate-500">Örnek Tarımsal Finans Kurumu</div>
               <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Örnek İşletme Verileri</div>
             </div>
             <div className="h-8 w-8 rounded-full bg-agri-100 flex items-center justify-center text-agri-700 font-bold">
               TB
             </div>
          </div>
        </header>
        <div className="tour-workspace p-4 md:p-8 w-full max-w-7xl mx-auto print:p-0 print:max-w-none">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default InstitutionLayout;
