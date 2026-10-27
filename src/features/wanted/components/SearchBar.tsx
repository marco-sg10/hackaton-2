import { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  value?: string;
  onSearch: (value?: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value = '',
  onSearch,
  placeholder = 'Buscar por nombre o epíteto...',
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // Sincronizar estado cuando el valor externo cambia (ej. limpiar filtros)
  if (value !== prevValue) {
    setPrevValue(value);
    setSearchTerm(value);
  }

  const debouncedSearch = useDebounce(searchTerm, 350);

  // Disparar búsqueda solo cuando el valor debounced cambia respecto a la búsqueda activa
  useEffect(() => {
    if (debouncedSearch !== value) {
      onSearch(debouncedSearch.trim() || undefined);
    }
  }, [debouncedSearch, value, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch(undefined);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-300/70">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-amber-500/30 rounded-xl text-amber-100 placeholder-amber-200/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-inner text-sm"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          title="Limpiar búsqueda"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-300/60 hover:text-amber-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
