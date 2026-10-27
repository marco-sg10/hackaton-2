import { Link } from 'react-router-dom';
import type { WantedSummary } from '../types';

interface WantedCardProps {
  poster: WantedSummary;
}

export function WantedCard({ poster }: WantedCardProps) {
  const formatBounty = (amount: number) => {
    return new Intl.NumberFormat('es-PE').format(amount);
  };

  const getStatusBadge = (status: WantedSummary['status']) => {
    switch (status) {
      case 'AT_LARGE':
        return (
          <span className="px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Prófugo
          </span>
        );
      case 'CAPTURED':
        return (
          <span className="px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
            Capturado
          </span>
        );
      case 'MISSING':
        return (
          <span className="px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded bg-slate-500/20 text-slate-300 border border-slate-500/40">
            Desaparecido
          </span>
        );
      default:
        return null;
    }
  };

  const getFruitBadge = (fruit: WantedSummary['devilFruit']) => {
    if (!fruit) {
      return (
        <span className="text-xs text-amber-200/50">
          Sin Fruta
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs text-purple-300 font-medium bg-purple-900/40 px-2 py-0.5 rounded border border-purple-500/30">
        <span>🌀</span>
        <span>{fruit.type}</span>
      </span>
    );
  };

  return (
    <Link
      to={`/wanted/${poster.id}`}
      className="group relative flex flex-col bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg p-4 text-stone-900 border-2 border-amber-900/30 shadow-md hover:shadow-2xl hover:scale-[1.02] hover:border-amber-700 transition-all duration-200 overflow-hidden"
    >
      {/* Textura o sello envejecido en esquinas */}
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-950/40" />
      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-950/40" />
      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-950/40" />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-950/40" />

      {/* Encabezado WANTED */}
      <div className="text-center border-b border-stone-800/20 pb-2 mb-2">
        <span className="text-[10px] font-serif tracking-[0.25em] uppercase text-stone-600 block">
          Marine Headquarters
        </span>
        <h3 className="text-2xl font-black font-serif tracking-[0.18em] text-stone-900 leading-none mt-0.5">
          WANTED
        </h3>
      </div>

      {/* Marco de Retrato */}
      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-amber-900/10 to-stone-900/20 border-2 border-stone-800/40 rounded flex flex-col items-center justify-center p-3 mb-3 shadow-inner">
        {/* Silueta / Icono pirata */}
        <div className="w-14 h-14 rounded-full bg-stone-800/20 flex items-center justify-center text-stone-700 mb-1 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5z" />
          </svg>
        </div>

        {/* Nivel de amenaza (Threat Level 1-5) */}
        <div className="flex items-center gap-1 mt-1" title={`Nivel de amenaza: ${poster.threatLevel}/5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`text-xs ${
                i < poster.threatLevel ? 'text-amber-600 font-bold' : 'text-stone-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Badge de estado flotante */}
        <div className="absolute top-2 right-2">
          {getStatusBadge(poster.status)}
        </div>
      </div>

      {/* Nombre y Epíteto */}
      <div className="text-center mb-3">
        <h4 className="font-serif font-black text-lg text-stone-950 uppercase tracking-wide leading-tight line-clamp-1 group-hover:text-amber-900 transition-colors">
          {poster.name}
        </h4>
        <p className="text-xs font-serif italic text-stone-700 line-clamp-1">
          "{poster.epithet}"
        </p>
      </div>

      {/* Recompensa (DEAD OR ALIVE + Berries) */}
      <div className="mt-auto bg-stone-900/10 rounded-md p-2 text-center border border-stone-800/20">
        <div className="text-[10px] font-serif uppercase tracking-widest text-stone-700 font-bold">
          DEAD OR ALIVE
        </div>
        <div className="font-serif font-black text-xl text-amber-950 tracking-tight flex items-center justify-center gap-1 mt-0.5">
          <span className="text-base font-sans font-bold">฿</span>
          <span>{formatBounty(poster.bounty)}</span>
        </div>
      </div>

      {/* Metadatos adicionales: Tripulación, Fruta, Isla */}
      <div className="mt-2 pt-2 border-t border-stone-800/15 flex flex-col gap-1 text-[11px] text-stone-700">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-stone-600">Tripulación:</span>
          <span className="font-medium text-stone-900 truncate max-w-[120px]" title={poster.crew.name}>
            {poster.crew.name}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-stone-600">Fruta:</span>
          {getFruitBadge(poster.devilFruit)}
        </div>
        <div className="flex justify-between items-center text-[10px] text-stone-500">
          <span>Última vez visto:</span>
          <span className="truncate max-w-[120px]">{poster.lastSeenIsland}</span>
        </div>
      </div>
    </Link>
  );
}
