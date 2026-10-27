import type { Crew, FruitType, WantedFilterParams, WantedSort, WantedStatus } from '../types';

interface FilterPanelProps {
  filters: WantedFilterParams;
  crews: Crew[];
  isLoadingCrews: boolean;
  onStatusChange: (status?: WantedStatus) => void;
  onCrewChange: (crewId?: string) => void;
  onFruitChange: (fruit?: FruitType) => void;
  onSortChange: (sort?: WantedSort) => void;
  onSizeChange: (size: 10 | 20 | 50) => void;
  onResetFilters: () => void;
}

export function FilterPanel({
  filters,
  crews,
  isLoadingCrews,
  onStatusChange,
  onCrewChange,
  onFruitChange,
  onSortChange,
  onSizeChange,
  onResetFilters,
}: FilterPanelProps) {
  const hasActiveFilters = Boolean(
    filters.status ||
    filters.crewId ||
    filters.fruit ||
    filters.q ||
    (filters.sort && filters.sort !== 'bounty,desc') ||
    filters.size !== 20
  );

  return (
    <div className="bg-slate-900/70 border border-amber-500/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-amber-100 shadow-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Filtro Estado */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1.5">
            Estado
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onStatusChange((e.target.value as WantedStatus) || undefined)}
            className="w-full px-3 py-2 bg-slate-800/90 border border-amber-500/30 rounded-xl text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm cursor-pointer"
          >
            <option value="">Todos los estados</option>
            <option value="AT_LARGE">Prófugo (At Large)</option>
            <option value="CAPTURED">Capturado</option>
            <option value="MISSING">Desaparecido</option>
          </select>
        </div>

        {/* Filtro Tripulación */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1.5">
            Tripulación
          </label>
          <select
            value={filters.crewId || ''}
            onChange={(e) => onCrewChange(e.target.value || undefined)}
            disabled={isLoadingCrews}
            className="w-full px-3 py-2 bg-slate-800/90 border border-amber-500/30 rounded-xl text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm cursor-pointer disabled:opacity-50"
          >
            <option value="">Todas las tripulaciones</option>
            {crews.map((crew) => (
              <option key={crew.id} value={crew.id}>
                {crew.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Fruta del Diablo */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1.5">
            Fruta del Diablo
          </label>
          <select
            value={filters.fruit || ''}
            onChange={(e) => onFruitChange((e.target.value as FruitType) || undefined)}
            className="w-full px-3 py-2 bg-slate-800/90 border border-amber-500/30 rounded-xl text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm cursor-pointer"
          >
            <option value="">Todas las frutas</option>
            <option value="PARAMECIA">Paramecia</option>
            <option value="ZOAN">Zoan</option>
            <option value="LOGIA">Logia</option>
            <option value="NONE">Sin fruta</option>
          </select>
        </div>

        {/* Ordenamiento */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1.5">
            Ordenar por
          </label>
          <select
            value={filters.sort || 'bounty,desc'}
            onChange={(e) => onSortChange(e.target.value as WantedSort)}
            className="w-full px-3 py-2 bg-slate-800/90 border border-amber-500/30 rounded-xl text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm cursor-pointer"
          >
            <option value="bounty,desc">Mayor Recompensa</option>
            <option value="name,asc">Nombre (A - Z)</option>
            <option value="updatedAt,desc">Última Actualización</option>
          </select>
        </div>

        {/* Por Página */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1.5">
            Mostrar
          </label>
          <select
            value={filters.size}
            onChange={(e) => onSizeChange(Number(e.target.value) as 10 | 20 | 50)}
            className="w-full px-3 py-2 bg-slate-800/90 border border-amber-500/30 rounded-xl text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm cursor-pointer"
          >
            <option value={10}>10 carteles</option>
            <option value={20}>20 carteles</option>
            <option value={50}>50 carteles</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-amber-500/10 flex justify-end">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-amber-100 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Restablecer todos los filtros
          </button>
        </div>
      )}
    </div>
  );
}
