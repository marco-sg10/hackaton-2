import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useWantedFilters } from './hooks/useWantedFilters';
import { useWanted } from './hooks/useWanted';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { WantedGrid } from './components/WantedGrid';
import { Pagination } from './components/Pagination';

export default function WantedPage() {
  const { user } = useAuth();
  const {
    filters,
    setPage,
    setSize,
    setStatus,
    setCrewId,
    setFruit,
    setSearch,
    setSort,
    resetFilters,
  } = useWantedFilters();

  const { data, isLoading, error, retry, crews, isLoadingCrews } = useWanted(
    filters,
    setPage // Callback si la página pedida excede el total tras filtrar
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-amber-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabecera Náutica */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
          <div>
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
                  <span>⚓</span> Carteles de "Se Busca"
                </h1>
                <p className="text-xs sm:text-sm text-amber-200/70 mt-0.5">
                  Base de datos de recompensas de la Guild de Cazarrecompensas · Tripulación:{' '}
                  <span className="font-semibold text-amber-300">{user?.teamName}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Buscador debounced */}
          <div className="w-full md:w-auto">
            <SearchBar
              value={filters.q}
              onSearch={setSearch}
              placeholder="Buscar por nombre o epíteto..."
            />
          </div>
        </header>

        {/* Panel de Filtros Combinables */}
        <section aria-label="Filtros de búsqueda">
          <FilterPanel
            filters={filters}
            crews={crews}
            isLoadingCrews={isLoadingCrews}
            onStatusChange={setStatus}
            onCrewChange={setCrewId}
            onFruitChange={setFruit}
            onSortChange={setSort}
            onSizeChange={setSize}
            onResetFilters={resetFilters}
          />
        </section>

        {/* Grid de Carteles / Skeletons / Error / Vacío */}
        <section aria-label="Listado de carteles">
          <WantedGrid
            posters={data?.content || []}
            isLoading={isLoading}
            error={error}
            onRetry={retry}
            onResetFilters={resetFilters}
            size={filters.size}
          />
        </section>

        {/* Paginación del Servidor */}
        {data && (
          <section aria-label="Paginación" className="pt-4 border-t border-amber-500/20">
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              size={data.size}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          </section>
        )}
      </div>
    </div>
  );
}
