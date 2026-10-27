import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getNewsFeed } from '../api';
import type { NewsFilterParams, NewsFeedResponse, NewsItem } from '../types';

export function useInfiniteScroll(filters: Omit<NewsFilterParams, 'cursor' | 'limit'>) {
  const { token } = useAuth();

  const [items, setItems] = useState<NewsItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [retryCount, setRetryCount] = useState(0);
  const filtersRef = useRef(filters);
  const requestIdRef = useRef(0);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const loadInitial = useCallback(async () => {
    if (!token) return;

    const currentRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    setItems([]);
    setNextCursor(null);
    setHasMore(true);

    try {
      const response: NewsFeedResponse = await getNewsFeed(
        token,
        { ...filtersRef.current, limit: 20 },
        undefined
      );

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      setItems(response.items);
      setNextCursor(response.nextCursor);
      setHasMore(response.hasMore);
      setError(null);
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) {
        return;
      }
      setError(err instanceof Error ? err.message : 'Error al cargar noticias');
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [token]);

  const loadMore = useCallback(async () => {
    if (!token || isLoadingMore || !hasMore || !nextCursor) {
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    setIsLoadingMore(true);

    try {
      const response: NewsFeedResponse = await getNewsFeed(
        token,
        { ...filtersRef.current, cursor: nextCursor, limit: 20 },
        undefined
      );

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      setItems((prev) => [...prev, ...response.items]);
      setNextCursor(response.nextCursor);
      setHasMore(response.hasMore);
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) {
        return;
      }
      setError(err instanceof Error ? err.message : 'Error al cargar más noticias');
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoadingMore(false);
      }
    }
  }, [token, isLoadingMore, hasMore, nextCursor]);

  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    loadInitial();
  }, [retryCount, loadInitial]);

  const updateItem = useCallback((updatedItem: NewsItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, []);

  return {
    items,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    retry,
    updateItem,
  };
}
