import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { NewsPriority, NewsStatus, NewsType } from '../types';

const VALID_TYPES: NewsType[] = ['PIRATE', 'MARINE', 'REVOLUTIONARY', 'WORLD_GOVERNMENT', 'OTHER'];
const VALID_PRIORITIES: NewsPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const VALID_STATUSES: NewsStatus[] = ['RUMOR', 'CONFIRMED', 'DEBUNKED'];

export function useNewsFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const rawType = searchParams.get('type');
    let type: NewsType | undefined;
    if (rawType && VALID_TYPES.includes(rawType as NewsType)) {
      type = rawType as NewsType;
    }

    const rawPriority = searchParams.get('priority');
    let priority: NewsPriority | undefined;
    if (rawPriority && VALID_PRIORITIES.includes(rawPriority as NewsPriority)) {
      priority = rawPriority as NewsPriority;
    }

    const rawStatus = searchParams.get('status');
    let status: NewsStatus | undefined;
    if (rawStatus && VALID_STATUSES.includes(rawStatus as NewsStatus)) {
      status = rawStatus as NewsStatus;
    }

    return { type, priority, status };
  }, [searchParams]);

  const updateFilters = useCallback(
    (updates: Partial<{ type: NewsType; priority: NewsPriority; status: NewsStatus }>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          if (updates.type !== undefined) {
            if (updates.type) {
              next.set('type', updates.type);
            } else {
              next.delete('type');
            }
          }

          if (updates.priority !== undefined) {
            if (updates.priority) {
              next.set('priority', updates.priority);
            } else {
              next.delete('priority');
            }
          }

          if (updates.status !== undefined) {
            if (updates.status) {
              next.set('status', updates.status);
            } else {
              next.delete('status');
            }
          }

          return next;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );

  const setType = useCallback(
    (newType?: NewsType) => {
      updateFilters({ type: newType });
    },
    [updateFilters]
  );

  const setPriority = useCallback(
    (newPriority?: NewsPriority) => {
      updateFilters({ priority: newPriority });
    },
    [updateFilters]
  );

  const setStatus = useCallback(
    (newStatus?: NewsStatus) => {
      updateFilters({ status: newStatus });
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: false });
  }, [setSearchParams]);

  return {
    filters,
    setType,
    setPriority,
    setStatus,
    resetFilters,
  };
}
