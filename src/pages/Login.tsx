import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, User, Wheat, AlertCircle } from 'lucide-react';
import { demoUsers } from '../auth/demoUsers';
import { sessionService } from '../auth/session';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleDemoLogin = (role: 'institution' | 'producer') => {
    const user = demoUsers.find(u => u.role === role);
    if (user) {
      sessionService.login(user);
      navigate(role === 'institution' ? '/institution/dashboard' : '/producer/home');
    }
  };

  const handleFormLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const user = demoUsers.find(u => u.email === email && u.demoPassword === password);
    
    if (user) {
      sessionService.login(user);
      navigate(user.role === 'institution' ? '/institution/dashboard' : '/producer/home');
    } else {
      setError('Hatalı e-posta veya şifre. Lütfen demo hesap bilgilerini kullanın.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex flex-col items-center justify-center hover:opacity-80 transition-opacity">
          <Wheat className="h-12 w-12 text-agri-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-fin-900">
            AgriScore AI İnceleme Girişi
          </h2>
        </Link>
        <p className="mt-2 text-center text-sm text-slate-600 max-w">
          Bu yarışma teslim sürümü, kurumsal panel ve üretici paneli olmak üzere iki farklı kullanıcı deneyimiyle incelenebilir. Gerçek finansal işlem yapılmaz.
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
              <p className="text-sm text-slate-700 font-medium mb-2">Demo Hesap Bilgisi:</p>
              <p className="text-sm text-slate-600">E-posta: <strong>kurum@agriscore.demo</strong></p>
              <p className="text-sm text-slate-600">Şifre: <strong>Demo1234</strong></p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => handleDemoLogin('institution')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fin-600 hover:bg-fin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fin-500"
              >
                Kurumsal Demo ile Gir
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
              <p className="text-sm text-slate-700 font-medium mb-2">Demo Hesap Bilgisi:</p>
              <p className="text-sm text-slate-600">E-posta: <strong>uretici@agriscore.demo</strong></p>
              <p className="text-sm text-slate-600">Şifre: <strong>Demo1234</strong></p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => handleDemoLogin('producer')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-agri-600 hover:bg-agri-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-500"
              >
                Üretici Demo ile Gir
              </button>
            </div>
          </div>

        </div>

        {/* Manuel Giriş Formu */}
        <div className="mt-8 bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <p className="text-sm text-slate-500 text-center mb-6">Mevcut bir hesaba form üzerinden giriş yapın:</p>
          
          {error && (
            <div className="mb-4 bg-red-50 p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleFormLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                E-posta Adresi
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-fin-500 focus:border-fin-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Şifre
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-fin-500 focus:border-fin-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fin-500"
              >
                Bilgileri Forma Doldurarak Gir
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Bu girişler yalnızca yarışma incelemesi için oluşturulmuş demo hesaplardır. Gerçek kredi başvurusu, finansal işlem veya resmi kurum doğrulaması yapılmaz.
        </div>
      </div>
    </div>
  );
};

export default Login;
