import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LineChart, Wallet, LogOut, GraduationCap, FileText, CheckSquare, Wheat, FileUp } from 'lucide-react';
import { sessionService } from '../../auth/session';

const ProducerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionService.logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/producer/home', label: 'Çiftliğim', icon: Home },
    { path: '/producer/production', label: 'Üretim & Verim', icon: LineChart },
    { path: '/producer/finance', label: 'Finansal Sağlık', icon: Wallet },
    { path: '/producer/documents', label: 'Belgelerim', icon: FileText },
    { path: '/producer/opportunities', label: 'Uygun Destekler', icon: GraduationCap },
    { path: '/producer/readiness', label: 'Hazırlık Rehberi', icon: CheckSquare },
    { path: '/producer/cks-analiz', label: 'Dinamik ÇKS Yükle', icon: FileUp },
  ];

  return (
    <div className="flex min-h-screen bg-fin-50 print:bg-white print:h-auto">
      {/* Sidebar */}
      <aside className="tour-sidebar fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col print:hidden z-40">
        <Link to="/" className="h-16 flex items-center px-6 border-b border-slate-200 bg-agri-50 hover:bg-agri-100 transition-colors">
          <Wheat className="h-8 w-8 text-agri-600 mr-2" />
          <span className="text-xl font-bold text-agri-900">AgriScore AI</span>
        </Link>
        
        <div className="px-6 py-4 border-b border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-semibold">Üretici Paneli</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors tour-menu-${item.path.split('/').pop()} ${
                  isActive 
                    ? 'bg-agri-50 text-agri-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-agri-900'
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
            className="w-full flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-agri-900 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 print:ml-0 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 print:hidden sticky top-0 z-30 shadow-sm">
          <h1 className="text-lg font-medium text-slate-800">
            Üretici Özeti
          </h1>
          <div className="flex items-center space-x-4">
             <div className="text-sm text-slate-500">
               Demo Hesap: Ahmet Yılmaz
             </div>
             <div className="h-8 w-8 rounded-full bg-agri-100 flex items-center justify-center text-agri-700 font-bold">
               AY
             </div>
          </div>
        </header>
        <div className="tour-workspace p-8 max-w-7xl mx-auto print:p-0 print:max-w-none">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProducerLayout;
