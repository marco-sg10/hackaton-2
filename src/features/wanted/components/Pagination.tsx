interface PaginationProps {
  page: number; // 0-based
  totalPages: number;
  totalElements: number;
  size: number;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  page,
  totalPages,
  totalElements,
  size,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1 && totalElements === 0) {
    return null;
  }

  const currentPage = page + 1; // 1-based para UI
  const startItem = totalElements === 0 ? 0 : page * size + 1;
  const endItem = Math.min((page + 1) * size, totalElements);

  // Generar números de página visibles
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let left = Math.max(2, currentPage - 1);
      let right = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        right = 4;
      }
      if (currentPage >= totalPages - 2) {
        left = totalPages - 3;
      }

      if (left > 2) {
        pages.push('ellipsis');
      }

      for (let i = left; i <= right; i++) {
        pages.push(i);
      }

      if (right < totalPages - 1) {
        pages.push('ellipsis');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-sm text-amber-200/80">
      {/* Resumen de conteo */}
      <div className="text-xs sm:text-sm font-medium">
        Mostrando <span className="font-bold text-amber-300">{startItem}</span> -{' '}
        <span className="font-bold text-amber-300">{endItem}</span> de{' '}
        <span className="font-bold text-amber-300">{totalElements}</span> carteles
        {totalPages > 0 && (
          <span className="ml-2 text-amber-200/60">
            (Pág. {currentPage} de {totalPages})
          </span>
        )}
      </div>

      {/* Controles de navegación */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Botón Primera Página */}
        <button
          type="button"
          onClick={() => onPageChange(0)}
          disabled={page === 0 || isLoading}
          title="Primera página"
          className="p-2 rounded-lg bg-slate-900/80 border border-amber-500/20 text-amber-200 hover:bg-amber-500/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {/* Botón Anterior */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0 || isLoading}
          className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-amber-500/20 text-amber-200 hover:bg-amber-500/20 disabled:opacity-30 disabled:pointer-events-none transition-colors text-xs font-semibold flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Anterior</span>
        </button>

        {/* Botones numéricos */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((p, index) => {
            if (p === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-amber-400/50">
                  ...
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p - 1)}
                disabled={isLoading || isCurrent}
                className={`min-w-8 h-8 px-2 rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-amber-500 text-stone-950 shadow-md font-black pointer-events-none'
                    : 'bg-slate-900/80 border border-amber-500/20 text-amber-200 hover:bg-amber-500/20'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Botón Siguiente */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1 || isLoading}
          className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-amber-500/20 text-amber-200 hover:bg-amber-500/20 disabled:opacity-30 disabled:pointer-events-none transition-colors text-xs font-semibold flex items-center gap-1"
        >
          <span>Siguiente</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Botón Última Página */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={page >= totalPages - 1 || isLoading}
          title="Última página"
          className="p-2 rounded-lg bg-slate-900/80 border border-amber-500/20 text-amber-200 hover:bg-amber-500/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
