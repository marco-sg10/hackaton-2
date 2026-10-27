import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getCrews, getWantedPosters } from '../api';
import type { Crew, WantedFilterParams, WantedPageResponse } from '../types';

export function useWanted(
  filters: WantedFilterParams,
  onPageCorrection?: (validPage: number) => void
) {
  const { token } = useAuth();

  const [data, setData] = useState<WantedPageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [crews, setCrews] = useState<Crew[]>([]);
  const [isLoadingCrews, setIsLoadingCrews] = useState(false);

  const [retryCount, setRetryCount] = useState(0);

  const onPageCorrectionRef = useRef(onPageCorrection);
  useEffect(() => {
    onPageCorrectionRef.current = onPageCorrection;
  }, [onPageCorrection]);

  // Cargar tripulaciones
  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();
    setIsLoadingCrews(true);

    getCrews(token, controller.signal)
      .then((crewList) => {
        setCrews(crewList);
        setIsLoadingCrews(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Error cargando tripulaciones:', err);
          setIsLoadingCrews(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [token]);

  const { page, size, status, crewId, fruit, q, sort } = filters;

  // Cargar carteles con AbortController (Regla del Log Pose: nunca muestra rumbo falso)
  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    const queryParams: WantedFilterParams = {
      page,
      size,
      status,
      crewId,
      fruit,
      q,
      sort,
    };

    getWantedPosters(token, queryParams, controller.signal)
      .then((result) => {
        // Validar si la página pedida supera el total disponible
        if (result.totalPages > 0 && page >= result.totalPages) {
          onPageCorrectionRef.current?.(Math.max(0, result.totalPages - 1));
        }
        setData(result);
        setError(null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          // Petición cancelada porque llegó una nueva, no es error de UI
          return;
        }
        setError(err.message || 'Error al obtener los carteles de Se Busca');
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [token, page, size, status, crewId, fruit, q, sort, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  return {
    data,
    isLoading,
    error,
    retry,
    crews,
    isLoadingCrews,
  };
}
