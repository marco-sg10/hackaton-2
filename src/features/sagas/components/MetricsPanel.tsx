import type { Palette, StageMetric } from '../types';

interface MetricsPanelProps {
  metrics: StageMetric[];
  palette: Palette;
}

export function MetricsPanel({ metrics, palette }: MetricsPanelProps) {
  const getMetricIcon = (key: string) => {
    switch (key) {
      case 'distanceNm':
        return '🧭';
      case 'crewMorale':
        return '🏴‍☠️';
      case 'bountyPool':
        return '💰';
      case 'marineThreat':
        return '⚓';
      default:
        return '📊';
    }
  };

  const formatMetricValue = (key: string, value: number, unit: string) => {
    if (key === 'bountyPool') {
      return `฿ ${new Intl.NumberFormat('es-PE').format(value)}`;
    }
    return `${new Intl.NumberFormat('es-PE').format(value)} ${unit}`.trim();
  };

  return (
    <div
      className="w-full rounded-2xl border p-4 backdrop-blur-md shadow-xl transition-colors duration-500"
      style={{
        backgroundColor: `${palette.surface}e6`,
        borderColor: `${palette.primary}40`,
      }}
    >
      <h4 className="text-xs font-serif font-black tracking-wider uppercase mb-3 opacity-75 flex items-center gap-1.5">
        <span>📜</span> Métricas de la Travesía
      </h4>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.key}
            className="p-3 rounded-xl border flex flex-col justify-between transition-all duration-300"
            style={{
              backgroundColor: `${palette.background}60`,
              borderColor: `${palette.primary}20`,
            }}
          >
            <div className="flex items-center gap-1.5 text-xs opacity-80 mb-1">
              <span>{getMetricIcon(metric.key)}</span>
              <span className="truncate">{metric.label}</span>
            </div>
            <div
              className="text-base sm:text-lg font-black font-mono tracking-tight"
              style={{ color: palette.primary }}
            >
              {formatMetricValue(metric.key, metric.value, metric.unit)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
