import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { ApiError } from './api';

export default function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fromLoc = (location.state as { from?: { pathname: string; search?: string } })?.from;
      const from = fromLoc ? `${fromLoc.pathname}${fromLoc.search || ''}` : '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(teamName, email, password);
      }
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (field?: string) => {
    if (error?.field === field && error) {
      return error.message;
    }
    if (!field && error?.message && !error.field) {
      return error.message;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Log Pose Console
        </h1>
        <p className="text-blue-200 text-center mb-6">
          Guild de Cazarrecompensas
        </p>

        <div className="flex mb-6 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => {
              setIsLogin(true);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${
              isLogin
                ? 'bg-blue-600 text-white'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${
              !isLogin
                ? 'bg-blue-600 text-white'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            Registro
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-1">
                Nombre de Tripulación
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Straw Hat Pirates"
                required
              />
              {getErrorMessage('teamName') && (
                <p className="text-red-400 text-sm mt-1">
                  {getErrorMessage('teamName')}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-blue-200 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tripulacion@ejemplo.com"
              required
            />
            {getErrorMessage('email') && (
              <p className="text-red-400 text-sm mt-1">{getErrorMessage('email')}</p>
            )}
          </div>

          <div>
            <label className="block text-blue-200 text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
            {getErrorMessage('password') && (
              <p className="text-red-400 text-sm mt-1">
                {getErrorMessage('password')}
              </p>
            )}
          </div>

          {getErrorMessage() && (
            <p className="text-red-400 text-sm text-center">
              {getErrorMessage()}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrar Tripulación'}
          </button>
        </form>
      </div>
    </div>
  );
}
