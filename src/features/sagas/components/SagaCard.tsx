import { useNavigate } from 'react-router-dom';
import type { SagaSummary } from '../types';

interface SagaCardProps {
  saga: SagaSummary;
}

export function SagaCard({ saga }: SagaCardProps) {
  const navigate = useNavigate();

  const handleOpenStory = () => {
    // Soporte para View Transition API cuando exista en el navegador y navegación normal cuando no
    if ('startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        navigate(`/sagas/${saga.id}`);
      });
    } else {
      navigate(`/sagas/${saga.id}`);
    }
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl p-6 sm:p-7 border border-amber-500/25 backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.015] overflow-hidden"
      style={{
        backgroundColor: `${saga.palette.surface}dd`,
        color: saga.palette.text,
      }}
    >
      {/* Acento lateral con la paleta de la saga */}
      <div
        className="absolute top-0 left-0 bottom-0 w-2 transition-all duration-300 group-hover:w-3"
        style={{ backgroundColor: saga.palette.primary }}
      />

      {/* Cabecera de la Saga */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span
          className="px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg border font-mono"
          style={{
            backgroundColor: `${saga.palette.primary}25`,
            borderColor: saga.palette.primary,
            color: saga.palette.primary,
          }}
        >
          Saga #{saga.order}
        </span>
        <span className="text-xs font-mono opacity-70">
          {saga.stageCount} Etapas · {saga.totalDistanceNm} mn
        </span>
      </div>

      {/* Título y Subtítulo */}
      <h3 className="text-2xl sm:text-3xl font-black font-serif tracking-wide mb-1 leading-snug">
        {saga.title}
      </h3>
      <p
        className="text-sm font-medium tracking-wide mb-4 italic"
        style={{ color: saga.palette.accent }}
      >
        {saga.subtitle}
      </p>

      {/* Sinopsis */}
      <p className="text-sm leading-relaxed opacity-85 mb-6 line-clamp-3">
        {saga.synopsis}
      </p>

      {/* Ruta: Primera Isla a Última Isla */}
      <div
        className="mt-auto p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm mb-6"
        style={{
          backgroundColor: `${saga.palette.background}80`,
          borderColor: `${saga.palette.primary}30`,
        }}
      >
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
            Zarpe
          </span>
          <span className="font-bold">{saga.firstIsland}</span>
        </div>
        <div className="text-lg opacity-60">➔</div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
            Destino
          </span>
          <span className="font-bold">{saga.lastIsland}</span>
        </div>
      </div>

      {/* Botón de Iniciar Scrollytelling */}
      <button
        type="button"
        onClick={handleOpenStory}
        className="w-full py-3 px-5 rounded-xl font-bold font-serif text-sm tracking-wider uppercase transition-all duration-200 shadow-md flex items-center justify-center gap-2 group-hover:gap-3"
        style={{
          backgroundColor: saga.palette.primary,
          color: saga.palette.background,
        }}
      >
        <span>Descubrir la Historia</span>
        <span className="text-base transition-transform group-hover:translate-x-1">➔</span>
      </button>
    </div>
  );
}
