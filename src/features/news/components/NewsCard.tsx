import type { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
  onClick: () => void;
}

export function NewsCard({ news, onClick }: NewsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUMOR':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'CONFIRMED':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'DEBUNKED':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'text-red-400';
      case 'HIGH':
        return 'text-orange-400';
      case 'MEDIUM':
        return 'text-yellow-400';
      case 'LOW':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'PIRATE':
        return '🏴‍☠️ Pirata';
      case 'MARINE':
        return '⚓ Marina';
      case 'REVOLUTIONARY':
        return '⚔️ Revolucionario';
      case 'WORLD_GOVERNMENT':
        return '🏛️ Gobierno Mundial';
      case 'OTHER':
        return '📰 Otro';
      default:
        return type;
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 rounded-xl p-5 transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-amber-100 group-hover:text-amber-300 transition-colors line-clamp-2">
            {news.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
            <span className={`px-2 py-1 rounded-full border ${getStatusColor(news.status)}`}>
              {news.status}
            </span>
            <span className={`font-medium ${getPriorityColor(news.priority)}`}>
              {news.priority}
            </span>
            <span className="text-amber-200/60">
              {getTypeLabel(news.type)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-amber-200/70 line-clamp-3 mb-3">
        {news.content}
      </p>

      <div className="flex items-center justify-between text-xs text-amber-200/50">
        <div className="flex items-center gap-2">
          {news.author && <span>👤 {news.author}</span>}
          {news.location && <span>📍 {news.location}</span>}
        </div>
        <time dateTime={news.publishedAt}>
          {new Date(news.publishedAt).toLocaleDateString()}
        </time>
      </div>
    </button>
  );
}
