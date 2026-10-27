import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getSagas } from './api';
import { SagaCard } from './components/SagaCard';
import type { SagaSummary } from './types';

export default function SagasPage() {
  const { token, user } = useAuth();
  const [sagas, setSagas] = useState<SagaSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getSagas(token, controller.signal)
      .then((data) => {
        setSagas(data);
        setError(null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error al cargar las sagas');
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [token, retryKey]);

  const handleRetry = useCallback(() => {
    setRetryKey((prev) => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-amber-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabecera Náutica */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/30 transition-colors"
              title="Volver al Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-black font-serif tracking-wider text-amber-300 flex items-center gap-2">
                <span>🗿</span> Poneglyphs: Sagas del Grand Line
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/70 mt-0.5">
                Crónicas históricas desbloqueadas con el Log Pose · Tripulación:{' '}
                <span className="font-semibold text-amber-300">{user?.teamName}</span>
              </p>
            </div>
          </div>
        </header>

        {/* Estado de Error */}
        {error && (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center p-6 bg-slate-900/70 border border-rose-500/30 rounded-2xl backdrop-blur-md">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-amber-100 mb-2 font-serif">
              Error al consultar los Poneglyphs
            </h3>
            <p className="text-sm text-amber-200/70 max-w-md mb-6">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black rounded-xl shadow-lg transition-all"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Estado de Carga */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-slate-900/70 border border-amber-500/20 p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-6 bg-amber-500/20 rounded w-1/3" />
                  <div className="h-8 bg-amber-500/25 rounded w-3/4" />
                  <div className="h-4 bg-amber-500/15 rounded w-1/2" />
                  <div className="h-16 bg-amber-500/10 rounded w-full mt-4" />
                </div>
                <div className="h-12 bg-amber-500/20 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Estado Vacío */}
        {!isLoading && !error && sagas.length === 0 && (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center p-6 bg-slate-900/70 border border-amber-500/20 rounded-2xl">
            <p className="text-amber-200/70 font-serif text-lg">
              No hay sagas registradas en los archivos actuales.
            </p>
          </div>
        )}

        {/* Listado de Sagas Disponibles */}
        {!isLoading && !error && sagas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sagas.map((saga) => (
              <SagaCard key={saga.id} saga={saga} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
