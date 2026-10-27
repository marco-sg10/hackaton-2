import type { Palette, SagaStage } from '../types';

interface StageNarrativeSectionProps {
  stage: SagaStage;
  index: number;
  isActive: boolean;
  palette: Palette;
}

export function StageNarrativeSection({
  stage,
  index,
  isActive,
  palette,
}: StageNarrativeSectionProps) {
  return (
    <section
      id={`stage-${stage.slug}`}
      data-stage-index={index}
      data-stage-slug={stage.slug}
      className={`min-h-[85vh] py-16 sm:py-24 flex flex-col justify-center transition-all duration-700 ${
        isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-[0.98]'
      }`}
    >
      <div
        className="rounded-3xl p-6 sm:p-10 border-2 backdrop-blur-md shadow-2xl transition-all duration-500 relative overflow-hidden"
        style={{
          backgroundColor: `${palette.surface}f5`,
          borderColor: isActive ? palette.primary : `${palette.primary}30`,
          boxShadow: isActive ? `0 20px 40px -15px ${palette.primary}40` : undefined,
        }}
      >
        {/* Marca de agua / glifo Poneglyph de fondo */}
        <div
          className="absolute right-4 bottom-4 text-7xl sm:text-8xl select-none pointer-events-none font-serif opacity-10"
          style={{ color: palette.primary }}
        >
          𓊝
        </div>

        {/* Encabezado del Capítulo */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1 rounded-xl text-xs font-black font-mono uppercase tracking-wider"
              style={{
                backgroundColor: `${palette.primary}20`,
                color: palette.primary,
                border: `1px solid ${palette.primary}50`,
              }}
            >
              Capítulo {stage.order}
            </span>
            <span className="text-xs uppercase tracking-widest opacity-75 font-mono">
              📍 {stage.island.name}
            </span>
          </div>

          <span
            className="text-xs font-mono font-bold"
            style={{ color: palette.accent }}
          >
            #{stage.slug}
          </span>
        </div>

        {/* Título de la Etapa */}
        <h2 className="text-2xl sm:text-4xl font-black font-serif tracking-wide mb-6 leading-tight">
          {stage.title}
        </h2>

        {/* Párrafos de la Narrativa */}
        <div className="space-y-4 text-sm sm:text-base leading-relaxed opacity-90 font-serif">
          {stage.narrative.map((paragraph, pIdx) => (
            <p
              key={pIdx}
              className={pIdx === 0 ? 'first-letter:text-4xl first-letter:font-black first-letter:mr-1 first-letter:float-left' : ''}
              style={{
                color: palette.text,
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
