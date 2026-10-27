import { useState } from 'react';
import type { NewsItem } from '../types';
import { updateNewsStatus } from '../api';
import { useAuth } from '../../auth/AuthContext';

interface NewsDetailModalProps {
  news: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: NewsItem) => void;
}

export function NewsDetailModal({ news, isOpen, onClose, onUpdate }: NewsDetailModalProps) {
  const { token } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !news) return null;

  const handleVerify = async (status: 'CONFIRMED' | 'DEBUNKED') => {
    if (!token) return;

    setIsVerifying(true);
    setVerifyError(null);
    setSuccessMessage(null);

    try {
      const updated = await updateNewsStatus(token, news.id, status);
      onUpdate(updated);
      setSuccessMessage(status === 'CONFIRMED' ? '✓ Noticia confirmada' : '✗ Rumor desmentido');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : 'Error al verificar noticia');
    } finally {
      setIsVerifying(false);
    }
  };

  const canVerify = news.status === 'RUMOR';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-amber-100 mb-2">{news.title}</h2>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {news.type}
                </span>
                <span className="text-amber-200/70">{news.priority}</span>
                <span className="text-amber-200/70">{news.status}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg text-amber-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4 text-sm text-amber-200/60">
              {news.author && (
                <span className="flex items-center gap-1">
                  <span>👤</span> {news.author}
                </span>
              )}
              {news.location && (
                <span className="flex items-center gap-1">
                  <span>📍</span> {news.location}
                </span>
              )}
              <time dateTime={news.publishedAt}>
                {new Date(news.publishedAt).toLocaleString()}
              </time>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-amber-100 leading-relaxed whitespace-pre-wrap">
                {news.content}
              </p>
            </div>
          </div>

          {canVerify && (
            <div className="border-t border-amber-500/20 pt-4">
              <h3 className="text-sm font-semibold text-amber-200 mb-3">
                Verificar Rumor
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleVerify('CONFIRMED')}
                  disabled={isVerifying}
                  className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors font-medium"
                >
                  {isVerifying ? 'Verificando...' : '✓ Confirmar'}
                </button>
                <button
                  onClick={() => handleVerify('DEBUNKED')}
                  disabled={isVerifying}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-lg transition-colors font-medium"
                >
                  {isVerifying ? 'Verificando...' : '✗ Desmentir'}
                </button>
              </div>
              {verifyError && (
                <p className="text-red-400 text-sm mt-2">{verifyError}</p>
              )}
              {successMessage && (
                <p className="text-green-400 text-sm mt-2">{successMessage}</p>
              )}
            </div>
          )}

          {!canVerify && (
            <div className="border-t border-amber-500/20 pt-4">
              <p className="text-amber-200/60 text-sm">
                Esta noticia ya fue verificada como {news.status.toLowerCase()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
