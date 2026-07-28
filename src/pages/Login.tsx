import { useNavigate, Link } from 'react-router';
import { Building2, User, Wheat } from 'lucide-react';
import { demoUsers } from '../auth/demoUsers';
import { sessionService } from '../auth/session';

const Login = () => {
  const navigate = useNavigate();

  const handleWorkspaceOpen = (role: 'institution' | 'producer') => {
    const user = demoUsers.find(u => u.role === role);
    if (user) {
      sessionService.login(user);
      navigate(role === 'institution' ? '/institution/dashboard' : '/producer/home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex flex-col items-center justify-center hover:opacity-80 transition-opacity">
          <Wheat className="h-12 w-12 text-agri-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-fin-900">
            AgriScore’a Hoş Geldiniz
          </h2>
        </Link>
        <p className="mt-2 text-center text-sm text-slate-600 max-w">
          İhtiyacınıza uygun çalışma alanını seçin.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Kurumsal Panel Kartı */}
          <div className="bg-white py-8 px-6 shadow sm:rounded-lg border border-slate-200">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-fin-50 text-fin-700 mx-auto">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-center text-lg font-medium text-fin-900">Kurumsal Panel</h3>
            <p className="mt-2 text-sm text-slate-500 text-center">
              Finans kurumları ve tarımsal finans ekipleri için üretici portföyü, risk skorları, fırsat eşleşmeleri ve karar destek raporları.
            </p>
            
            <div className="mt-6 bg-slate-50 p-4 rounded-md border border-slate-200">
              <p className="text-sm text-slate-700 font-medium">Örnek çalışma alanı</p>
              <p className="text-sm text-slate-500 mt-1">
                Ürün işleyişini hazır işletme kayıtlarıyla güvenle inceleyin.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => handleWorkspaceOpen('institution')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fin-600 hover:bg-fin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fin-500"
              >
                Kurumsal Çalışma Alanını Aç
              </button>
            </div>
          </div>

          {/* Üretici Paneli Kartı */}
          <div className="bg-white py-8 px-6 shadow sm:rounded-lg border border-slate-200">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-agri-50 text-agri-700 mx-auto">
              <User className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-center text-lg font-medium text-fin-900">Üretici Paneli</h3>
            <p className="mt-2 text-sm text-slate-500 text-center">
              Çiftçiler ve süt üreticileri için çiftlik profili, finansal sağlık, eksik belgeler, uygun destekler ve başvuruya hazırlık görünümü.
            </p>
            
            <div className="mt-6 bg-slate-50 p-4 rounded-md border border-slate-200">
              <p className="text-sm text-slate-700 font-medium">Örnek çalışma alanı</p>
              <p className="text-sm text-slate-500 mt-1">
                Çiftlik görünümünü hazır işletme kayıtlarıyla güvenle inceleyin.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => handleWorkspaceOpen('producer')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-agri-600 hover:bg-agri-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-500"
              >
                Üretici Çalışma Alanını Aç
              </button>
            </div>
          </div>

        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Bu çalışma alanlarındaki kişi, kurum ve program kayıtları örnek amaçlıdır.
        </div>
      </div>
    </div>
  );
};

export default Login;
