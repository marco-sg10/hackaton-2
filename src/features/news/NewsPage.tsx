import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useNewsFilters } from './hooks/useNewsFilters';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { NewsCard } from './components/NewsCard';
import { NewsDetailModal } from './components/NewsDetailModal';
import type { NewsItem } from './types';

export default function NewsPage() {
  const { user } = useAuth();
  const { filters, setType, setPriority, setStatus, resetFilters } = useNewsFilters();

  const {
    items,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    retry,
    updateItem,
  } = useInfiniteScroll(filters);

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  const handleNewsClick = (news: NewsItem) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedNews(null), 300);
  };

  const handleNewsUpdate = (updated: NewsItem) => {
    updateItem(updated);
    if (selectedNews?.id === updated.id) {
      setSelectedNews(updated);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-amber-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/30 transition-colors"
              title="Volver al Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-black font-serif tracking-wider text-amber-300 flex items-center gap-2">
                <span>📰</span> News Coo
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/70 mt-0.5">
                Noticias del Grand Line · Tripulación:{' '}
                <span className="font-semibold text-amber-300">{user?.teamName}</span>
              </p>
            </div>
          </div>
        </header>

        <section className="flex flex-wrap gap-3 items-center">
          <FilterSelect
            label="Tipo"
            value={filters.type}
            options={[
              { value: '', label: 'Todos' },
              { value: 'PIRATE', label: '🏴‍☠️ Pirata' },
              { value: 'MARINE', label: '⚓ Marina' },
              { value: 'REVOLUTIONARY', label: '⚔️ Revolucionario' },
              { value: 'WORLD_GOVERNMENT', label: '🏛️ Gobierno Mundial' },
              { value: 'OTHER', label: '📰 Otro' },
            ]}
            onChange={(e) => setType(e.target.value as any)}
          />
          <FilterSelect
            label="Prioridad"
            value={filters.priority}
            options={[
              { value: '', label: 'Todas' },
              { value: 'LOW', label: '🔵 Baja' },
              { value: 'MEDIUM', label: '🟡 Media' },
              { value: 'HIGH', label: '🟠 Alta' },
              { value: 'CRITICAL', label: '🔴 Crítica' },
            ]}
            onChange={(e) => setPriority(e.target.value as any)}
          />
          <FilterSelect
            label="Estado"
            value={filters.status}
            options={[
              { value: '', label: 'Todos' },
              { value: 'RUMOR', label: '🟡 Rumor' },
              { value: 'CONFIRMED', label: '✓ Confirmada' },
              { value: 'DEBUNKED', label: '✗ Desmentida' },
            ]}
            onChange={(e) => setStatus(e.target.value as any)}
          />
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-200 rounded-lg border border-amber-500/30 transition-colors text-sm"
          >
            Limpiar Filtros
          </button>
        </section>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse">
                <div className="h-6 bg-white/10 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-white/10 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-white/10 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={retry}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
            <p className="text-amber-200/60 text-lg">No hay noticias con estos filtros</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="space-y-4">
            {items.map((news) => (
              <NewsCard key={news.id} news={news} onClick={() => handleNewsClick(news)} />
            ))}
          </div>
        )}

        {isLoadingMore && (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse">
                <div className="h-6 bg-white/10 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-white/10 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-white/10 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {!hasMore && !isLoading && items.length > 0 && (
          <div className="text-center py-8 text-amber-200/50">
            <p>📭 Fin de las noticias</p>
          </div>
        )}

        <div ref={loadMoreRef} className="h-4" />
      </div>

      <NewsDetailModal
        news={selectedNews}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleNewsUpdate}
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | undefined;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-xs text-amber-200/60 mb-1">{label}</label>
      <select
        value={value || ''}
        onChange={onChange}
        className="px-3 py-2 bg-slate-800 border border-amber-500/30 rounded-lg text-amber-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
