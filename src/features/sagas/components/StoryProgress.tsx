import type { Palette } from '../types';

interface StoryProgressProps {
  currentStage: number; // 0-based
  totalStages: number;
  palette: Palette;
}

export function StoryProgress({
  currentStage,
  totalStages,
  palette,
}: StoryProgressProps) {
  const percentage = totalStages > 1 ? (currentStage / (totalStages - 1)) * 100 : 100;

  return (
    <div
      className="w-full rounded-xl border p-3 backdrop-blur-md shadow-md transition-colors duration-500"
      style={{
        backgroundColor: `${palette.surface}e6`,
        borderColor: `${palette.primary}30`,
      }}
    >
      <div className="flex items-center justify-between text-xs font-mono mb-1.5">
        <span className="font-bold">
          Etapa {currentStage + 1} de {totalStages}
        </span>
        <span className="font-bold" style={{ color: palette.accent }}>
          {Math.round(percentage)}% completado
        </span>
      </div>

      {/* Barra de progreso con soporte dual: CSS scroll-driven y fallback JS */}
      <div className="w-full h-2 rounded-full bg-slate-950/60 overflow-hidden relative border border-white/10">
        <div
          className="h-full rounded-full transition-all duration-500 motion-reduce:transition-none"
          style={{
            width: `${percentage}%`,
            backgroundColor: palette.primary,
            boxShadow: `0 0 10px ${palette.primary}`,
          }}
        />
      </div>
    </div>
  );
}
