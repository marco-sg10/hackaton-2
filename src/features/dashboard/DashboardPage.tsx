import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getDashboardSummary, getLogPoseStatus, type DashboardSummary, type LogPoseStatus } from './api';

export default function DashboardPage() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [logPose, setLogPose] = useState<LogPoseStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryData, logPoseData] = await Promise.all([
        getDashboardSummary(token!),
        getLogPoseStatus(token!),
      ]);
      setSummary(summaryData);
      setLogPose(logPoseData);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md border border-white/20 text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Log Pose Console</h1>
            <p className="text-blue-200 mt-1">
              Tripulación: {user?.teamName} ({user?.teamCode})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Carteles Se Busca"
            value={summary?.totalWanted ?? 0}
            subtitle={`${summary?.confirmedWanted ?? 0} confirmados`}
            color="from-red-500 to-red-600"
          />
          <StatCard
            title="Noticias del Mundo"
            value={summary?.totalNews ?? 0}
            subtitle={`${summary?.confirmedNews ?? 0} confirmadas`}
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Sagas Disponibles"
            value={summary?.totalSagas ?? 0}
            subtitle="Historia del Grand Line"
            color="from-purple-500 to-purple-600"
          />
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Estado del Log Pose</h2>
          {logPose?.hasLogPose ? (
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-green-400 text-lg">
                Log Pose activo - Desbloqueado el {new Date(logPose.unlockedAt!).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <p className="text-red-400 text-lg">
                Log Pose no activo - Debes aprobar la inspección en Reverse Mountain
              </p>
            </div>
          )}
        </div>

        <nav className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NavLink
            title="Carteles Se Busca"
            description="Explora los carteles de piratas buscados"
            path="/wanted"
            disabled={false}
          />
          <NavLink
            title="Noticias del Mundo"
            description="Lee las últimas noticias del Grand Line"
            path="/news"
            disabled={!logPose?.hasLogPose}
          />
          <NavLink
            title="Sagas del Grand Line"
            description="Descubre la historia del mundo"
            path="/sagas"
            disabled={!logPose?.hasLogPose}
          />
        </nav>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: number;
  subtitle: string;
  color: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white`}>
      <h3 className="text-lg font-medium opacity-90">{title}</h3>
      <p className="text-4xl font-bold mt-2">{value}</p>
      <p className="text-sm opacity-80 mt-1">{subtitle}</p>
    </div>
  );
}

function NavLink({
  title,
  description,
  path,
  disabled,
}: {
  title: string;
  description: string;
  path: string;
  disabled: boolean;
}) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => !disabled && navigate(path)}
      disabled={disabled}
      className={`p-6 rounded-2xl border text-left transition-all ${
        disabled
          ? 'bg-white/5 border-white/10 text-gray-400 cursor-not-allowed'
          : 'bg-white/10 border-white/20 hover:bg-white/20 text-white cursor-pointer'
      }`}
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
      {disabled && (
        <p className="text-xs text-red-400 mt-2">
          🔒 Requiere Log Pose (CP3)
        </p>
      )}
    </button>
  );
}
