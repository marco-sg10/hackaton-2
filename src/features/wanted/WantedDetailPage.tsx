import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getWantedPosterById } from './api';
import type { WantedDetail } from './types';

export default function WantedDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [poster, setPoster] = useState<WantedDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!token || !id) return;
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    getWantedPosterById(token, id, controller.signal)
      .then((data) => {
        setPoster(data);
        setError(null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error al cargar el detalle del cartel');
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [id, token, retryKey]);

  const handleRetry = useCallback(() => {
    setRetryKey((prev) => prev + 1);
  }, []);

  const handleBack = () => {
    // navigate(-1) regresa al listado exactamente en el estado que se dejó (URL params y scroll intactos)
    navigate(-1);
  };

  const formatBounty = (amount: number) => {
    return new Intl.NumberFormat('es-PE').format(amount);
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 flex items-center justify-center">
        <div className="text-center text-amber-200">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-lg tracking-wider">Consultando archivos del Marine HQ...</p>
        </div>
      </div>
    );
  }

  if (error || !poster) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 flex items-center justify-center">
        <div className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-8 max-w-md text-center backdrop-blur-md">
          <p className="text-rose-400 text-lg mb-4">{error || 'Cartel no encontrado'}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-200 rounded-xl transition-colors text-sm font-medium"
            >
              Volver al listado
            </button>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl transition-colors text-sm"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-amber-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Barra superior con botón volver */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/30 rounded-xl transition-colors font-medium text-sm shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver a los carteles</span>
          </button>
          <span className="text-xs uppercase tracking-widest text-amber-400/60 font-mono">
            ID: {poster.id}
          </span>
        </div>

        {/* Contenido principal en 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Cartel Gigante One Piece */}
          <div className="lg:col-span-5 bg-gradient-to-b from-amber-50 to-amber-100 text-stone-950 rounded-xl p-6 sm:p-8 border-4 border-amber-950/40 shadow-2xl relative">
            <div className="text-center border-b-2 border-stone-800/30 pb-3 mb-4">
              <span className="text-xs font-serif tracking-[0.3em] uppercase text-stone-600 font-bold block">
                Marine Headquarters
              </span>
              <h1 className="text-4xl sm:text-5xl font-black font-serif tracking-[0.15em] text-stone-950 leading-none mt-1">
                WANTED
              </h1>
            </div>

            {/* Marco de Retrato */}
            <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-amber-900/10 to-stone-900/20 border-2 border-stone-800/50 rounded-lg flex flex-col items-center justify-center p-4 mb-4 shadow-inner">
              <div className="w-20 h-20 rounded-full bg-stone-800/20 flex items-center justify-center text-stone-700 mb-2">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5z" />
                </svg>
              </div>

              {/* Nivel de amenaza */}
              <div className="flex items-center gap-1.5 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-base ${
                      i < poster.threatLevel ? 'text-amber-600 font-black' : 'text-stone-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Nombre y Epíteto */}
            <div className="text-center mb-5">
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-stone-950 uppercase tracking-wide">
                {poster.name}
              </h2>
              <p className="text-base font-serif italic text-stone-700 mt-0.5">
                "{poster.epithet}"
              </p>
            </div>

            {/* Recompensa */}
            <div className="bg-stone-950/10 rounded-lg p-3 text-center border-2 border-stone-800/25">
              <div className="text-xs font-serif uppercase tracking-widest text-stone-700 font-black">
                DEAD OR ALIVE
              </div>
              <div className="font-serif font-black text-2xl sm:text-3xl text-amber-950 tracking-tight flex items-center justify-center gap-1 mt-1">
                <span className="text-xl font-sans font-bold">฿</span>
                <span>{formatBounty(poster.bounty)}</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Expediente y Detalles */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Ficha técnica */}
            <div className="bg-slate-900/80 border border-amber-500/25 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold font-serif text-amber-300 border-b border-amber-500/20 pb-3 mb-4 flex items-center gap-2">
                <span>📜</span> Expediente del Marine HQ
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-amber-500/10">
                  <span className="text-xs text-amber-300/60 block font-semibold">Estado Actual</span>
                  <span className="font-bold text-amber-100 mt-0.5 block">{poster.status}</span>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-xl border border-amber-500/10">
                  <span className="text-xs text-amber-300/60 block font-semibold">Tripulación</span>
                  <span className="font-bold text-amber-100 mt-0.5 block truncate" title={poster.crew.name}>
                    {poster.crew.name}
                  </span>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-xl border border-amber-500/10">
                  <span className="text-xs text-amber-300/60 block font-semibold">Puesto / Rol</span>
                  <span className="font-bold text-amber-100 mt-0.5 block">{poster.role}</span>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-xl border border-amber-500/10">
                  <span className="text-xs text-amber-300/60 block font-semibold">Edad</span>
                  <span className="font-bold text-amber-100 mt-0.5 block">{poster.age} años</span>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-xl border border-amber-500/10">
                  <span className="text-xs text-amber-300/60 block font-semibold">Altura</span>
                  <span className="font-bold text-amber-100 mt-0.5 block">{poster.heightCm} cm</span>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-xl border border-amber-500/10">
                  <span className="text-xs text-amber-300/60 block font-semibold">Fruta del Diablo</span>
                  <span className="font-bold text-amber-100 mt-0.5 block truncate">
                    {poster.devilFruit ? `${poster.devilFruit.name} (${poster.devilFruit.type})` : 'Ninguna'}
                  </span>
                </div>
              </div>

              {/* Biografía */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-2">
                  Informe de Inteligencia (Biografía)
                </h4>
                <p className="text-sm text-amber-100/90 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-amber-500/15">
                  {poster.bio}
                </p>
              </div>

              {/* Último avistamiento */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <span className="text-amber-300/70 block">Último avistamiento registrado</span>
                  <span className="font-bold text-amber-200">{poster.lastSeen.island}</span>
                </div>
                <div className="text-right text-amber-300/80">
                  <span>{formatDate(poster.lastSeen.seenAt)}</span>
                </div>
              </div>
            </div>

            {/* Historial de Recompensas */}
            <div className="bg-slate-900/80 border border-amber-500/25 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold font-serif text-amber-300 border-b border-amber-500/20 pb-3 mb-4 flex items-center gap-2">
                <span>📈</span> Evolución de la Recompensa
              </h3>

              {poster.bountyHistory && poster.bountyHistory.length > 0 ? (
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-500/30">
                  {poster.bountyHistory.map((item, idx) => (
                    <div key={idx} className="relative flex items-center justify-between text-sm">
                      <div className="absolute -left-6 w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-950" />
                      <div className="flex flex-col">
                        <span className="font-mono text-amber-100 font-bold">
                          ฿ {formatBounty(item.amount)}
                        </span>
                        <span className="text-xs text-amber-200/50">
                          {idx === poster.bountyHistory.length - 1 ? 'Recompensa actual' : `Emisión #${idx + 1}`}
                        </span>
                      </div>
                      <span className="text-xs text-amber-300/70 font-mono">
                        {formatDate(item.issuedAt)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-amber-200/60">No hay registros de recompensas anteriores.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
