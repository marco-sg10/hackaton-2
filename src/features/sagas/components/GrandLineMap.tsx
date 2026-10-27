import type { Palette, SagaStage, SagaStoryMapCoordinates } from '../types';

interface GrandLineMapProps {
  mapCoordinates: SagaStoryMapCoordinates;
  stages: SagaStage[];
  activeStageIndex: number;
  palette: Palette;
  onSelectStage: (index: number) => void;
}

export function GrandLineMap({
  mapCoordinates,
  stages,
  activeStageIndex,
  palette,
  onSelectStage,
}: GrandLineMapProps) {
  const { width, height } = mapCoordinates;
  const currentStage = stages[activeStageIndex] || stages[0];
  const currentIsland = currentStage.island;

  // Construir la ruta recorrida hasta la etapa activa
  const traveledPathD = stages
    .slice(0, activeStageIndex + 1)
    .reduce((acc, stage, i) => {
      const { x, y } = stage.island;
      return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');

  // Construir la ruta proyectada (futura) desde la etapa activa hasta el final
  const futurePathD = stages
    .slice(activeStageIndex)
    .reduce((acc, stage, i) => {
      const { x, y } = stage.island;
      return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');

  return (
    <div
      className="relative w-full rounded-2xl border-2 p-3 sm:p-4 backdrop-blur-md shadow-2xl overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: `${palette.surface}f0`,
        borderColor: `${palette.primary}50`,
      }}
    >
      {/* Encabezado del Mapa */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-500/20 text-xs">
        <span className="font-serif font-black tracking-widest uppercase flex items-center gap-1.5">
          <span>🧭</span> Carta de Navegación · Grand Line
        </span>
        <span className="font-mono text-[11px] opacity-75">
          Isla: <strong style={{ color: palette.accent }}>{currentIsland.name}</strong>
        </span>
      </div>

      {/* Contenedor SVG con escala responsiva */}
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl bg-slate-950/60 shadow-inner">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Mapa náutico del Grand Line"
        >
          {/* Fondo náutico con cuadrícula y líneas de latitud/longitud */}
          <defs>
            <pattern id="nautical-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke={palette.primary}
                strokeWidth="0.5"
                strokeOpacity="0.12"
              />
            </pattern>
            {/* Filtro de resplandor para la isla activa */}
            <filter id="island-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width={width} height={height} fill="url(#nautical-grid)" />

          {/* Línea náutica decorativa (Ecuador / Grand Line calm belt) */}
          <line
            x1="0"
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke={palette.primary}
            strokeWidth="1"
            strokeOpacity="0.15"
            strokeDasharray="8 8"
          />

          {/* 1. Ruta Proyectada (Línea discontinua) */}
          {futurePathD && (
            <path
              d={futurePathD}
              fill="none"
              stroke={palette.text}
              strokeWidth="2"
              strokeDasharray="5 5"
              strokeOpacity="0.35"
              className="motion-reduce:transition-none"
            />
          )}

          {/* 2. Ruta Recorrida (Línea sólida trazada) */}
          {traveledPathD && (
            <path
              d={traveledPathD}
              fill="none"
              stroke={palette.primary}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-700 motion-reduce:transition-none"
            />
          )}

          {/* 3. Marcadores de Islas */}
          {stages.map((stage, idx) => {
            const isCurrent = idx === activeStageIndex;
            const isPast = idx < activeStageIndex;
            const { x, y, name } = stage.island;

            return (
              <g
                key={stage.id}
                onClick={() => onSelectStage(idx)}
                className="cursor-pointer group"
                role="button"
                tabIndex={0}
                aria-label={`Isla ${name}, etapa ${idx + 1}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectStage(idx);
                  }
                }}
              >
                {/* Anillo de pulso para la isla activa */}
                {isCurrent && (
                  <circle
                    cx={x}
                    cy={y}
                    r="16"
                    fill="none"
                    stroke={palette.accent}
                    strokeWidth="2"
                    strokeOpacity="0.8"
                    className="animate-ping"
                  />
                )}

                {/* Círculo de la Isla */}
                <circle
                  cx={x}
                  cy={y}
                  r={isCurrent ? 9 : 6}
                  fill={isCurrent ? palette.accent : isPast ? palette.primary : palette.surface}
                  stroke={palette.text}
                  strokeWidth={isCurrent ? 2.5 : 1.5}
                  filter={isCurrent ? 'url(#island-glow)' : undefined}
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* Etiqueta con el nombre de la isla */}
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  fill={isCurrent ? palette.accent : palette.text}
                  fontSize={isCurrent ? '12' : '10'}
                  fontWeight={isCurrent ? 'bold' : 'normal'}
                  fontFamily="serif"
                  className="pointer-events-none select-none transition-all duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                >
                  {name}
                </text>
              </g>
            );
          })}

          {/* 4. Barco Persistente Navegando */}
          <g
            style={{
              transform: `translate(${currentIsland.x}px, ${currentIsland.y}px)`,
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            className="pointer-events-none motion-reduce:transition-none"
          >
            {/* Sombra / aura debajo del barco */}
            <ellipse cx="0" cy="5" rx="12" ry="4" fill="black" fillOpacity="0.5" />

            {/* Ícono de Carabela / Barco Pirata */}
            <g transform="translate(-14, -18) scale(1.1)">
              {/* Casco del barco */}
              <path
                d="M 4 16 L 22 16 L 20 22 L 6 22 Z"
                fill="#854d0e"
                stroke="#451a03"
                strokeWidth="1.5"
              />
              {/* Mástil */}
              <line x1="13" y1="5" x2="13" y2="16" stroke="#451a03" strokeWidth="2" />
              {/* Velas */}
              <path
                d="M 13 6 C 18 8, 18 13, 13 14 Z"
                fill="#fef3c7"
                stroke="#78350f"
                strokeWidth="1"
              />
              {/* Bandera pirata */}
              <path d="M 13 5 L 8 3 L 13 1 Z" fill={palette.accent} />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
