import { WantedCard } from './WantedCard';
import type { WantedSummary } from '../types';

interface WantedGridProps {
  posters: WantedSummary[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onResetFilters: () => void;
  size: number;
}

export function WantedGrid({
  posters,
  isLoading,
  error,
  onRetry,
  onResetFilters,
  size,
}: WantedGridProps) {
  // Estado de Error
  if (error) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center p-6 bg-slate-900/60 border border-rose-500/30 rounded-2xl backdrop-blur-md">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-amber-100 mb-2 font-serif">
          Error en la comunicación con el Marine HQ
        </h3>
        <p className="text-sm text-amber-200/70 max-w-md mb-6">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          Reintentar consulta
        </button>
      </div>
    );
  }

  // Estado de Carga (Skeletons con el mismo grid y aspecto para evitar CLS)
  if (isLoading) {
    const skeletonCount = Math.min(size, 8);
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="flex flex-col bg-amber-100/10 rounded-lg p-4 border-2 border-amber-900/20 h-[380px]"
          >
            {/* Header skeleton */}
            <div className="h-4 bg-amber-200/20 rounded w-1/2 mx-auto mb-3" />
            <div className="h-6 bg-amber-200/25 rounded w-3/4 mx-auto mb-4" />

            {/* Photo frame skeleton */}
            <div className="aspect-[4/3] w-full bg-amber-200/15 rounded mb-4" />

            {/* Name skeleton */}
            <div className="h-5 bg-amber-200/25 rounded w-5/6 mx-auto mb-2" />
            <div className="h-3 bg-amber-200/15 rounded w-1/2 mx-auto mb-6" />

            {/* Bounty box skeleton */}
            <div className="mt-auto h-12 bg-amber-200/20 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Estado Vacío (Sin resultados)
  if (posters.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center p-6 bg-slate-900/60 border border-amber-500/20 rounded-2xl backdrop-blur-md">
        <div className="w-16 h-16 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-amber-100 mb-2 font-serif">
          No se encontraron carteles de "Se Busca"
        </h3>
        <p className="text-sm text-amber-200/70 max-w-md mb-6">
          Ningún pirata coincide con los filtros o el término de búsqueda actual.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl transition-colors font-medium text-sm"
        >
          Limpiar filtros y búsqueda
        </button>
      </div>
    );
  }

  // Grid de Carteles
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {posters.map((poster) => (
        <WantedCard key={poster.id} poster={poster} />
      ))}
    </div>
  );
}
