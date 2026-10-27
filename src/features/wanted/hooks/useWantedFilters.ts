import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FruitType, WantedFilterParams, WantedSort, WantedStatus } from '../types';

const VALID_SIZES = [10, 20, 50] as const;
const VALID_STATUSES: WantedStatus[] = ['AT_LARGE', 'CAPTURED', 'MISSING'];
const VALID_FRUITS: FruitType[] = ['PARAMECIA', 'ZOAN', 'LOGIA', 'NONE'];
const VALID_SORTS: WantedSort[] = ['bounty,desc', 'name,asc', 'updatedAt,desc'];

export function useWantedFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parsear y sanitizar parámetros de la URL
  const filters: WantedFilterParams = useMemo(() => {
    // 1. Page
    const rawPage = searchParams.get('page');
    let page = 0;
    if (rawPage !== null) {
      const parsedPage = parseInt(rawPage, 10);
      if (!isNaN(parsedPage) && parsedPage >= 0) {
        page = parsedPage;
      }
    }

    // 2. Size
    const rawSize = searchParams.get('size');
    let size: 10 | 20 | 50 = 20;
    if (rawSize !== null) {
      const parsedSize = parseInt(rawSize, 10);
      if (VALID_SIZES.includes(parsedSize as 10 | 20 | 50)) {
        size = parsedSize as 10 | 20 | 50;
      }
    }

    // 3. Status
    const rawStatus = searchParams.get('status');
    let status: WantedStatus | undefined;
    if (rawStatus && VALID_STATUSES.includes(rawStatus as WantedStatus)) {
      status = rawStatus as WantedStatus;
    }

    // 4. CrewId
    const rawCrewId = searchParams.get('crewId');
    let crewId: string | undefined;
    if (rawCrewId && rawCrewId.trim() !== '') {
      crewId = rawCrewId.trim();
    }

    // 5. Fruit
    const rawFruit = searchParams.get('fruit');
    let fruit: FruitType | undefined;
    if (rawFruit && VALID_FRUITS.includes(rawFruit as FruitType)) {
      fruit = rawFruit as FruitType;
    }

    // 6. Search q
    const rawQ = searchParams.get('q');
    let q: string | undefined;
    if (rawQ && rawQ.trim() !== '') {
      q = rawQ.trim();
    }

    // 7. Sort
    const rawSort = searchParams.get('sort');
    let sort: WantedSort = 'bounty,desc';
    if (rawSort && VALID_SORTS.includes(rawSort as WantedSort)) {
      sort = rawSort as WantedSort;
    }

    return { page, size, status, crewId, fruit, q, sort };
  }, [searchParams]);

  const updateFilters = useCallback(
    (updates: Partial<WantedFilterParams>, resetPage: boolean = true) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          if (resetPage) {
            next.set('page', '0');
          } else if (updates.page !== undefined) {
            next.set('page', updates.page.toString());
          }

          if (updates.size !== undefined) {
            next.set('size', updates.size.toString());
          }

          if (updates.status !== undefined) {
            if (updates.status) {
              next.set('status', updates.status);
            } else {
              next.delete('status');
            }
          }

          if (updates.crewId !== undefined) {
            if (updates.crewId) {
              next.set('crewId', updates.crewId);
            } else {
              next.delete('crewId');
            }
          }

          if (updates.fruit !== undefined) {
            if (updates.fruit) {
              next.set('fruit', updates.fruit);
            } else {
              next.delete('fruit');
            }
          }

          if (updates.q !== undefined) {
            if (updates.q && updates.q.trim()) {
              next.set('q', updates.q.trim());
            } else {
              next.delete('q');
            }
          }

          if (updates.sort !== undefined) {
            if (updates.sort && updates.sort !== 'bounty,desc') {
              next.set('sort', updates.sort);
            } else {
              next.delete('sort');
            }
          }

          return next;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );

  const setPage = useCallback(
    (newPage: number) => {
      updateFilters({ page: newPage }, false);
    },
    [updateFilters]
  );

  const setSize = useCallback(
    (newSize: 10 | 20 | 50) => {
      updateFilters({ size: newSize }, true);
    },
    [updateFilters]
  );

  const setStatus = useCallback(
    (newStatus?: WantedStatus) => {
      updateFilters({ status: newStatus }, true);
    },
    [updateFilters]
  );

  const setCrewId = useCallback(
    (newCrewId?: string) => {
      updateFilters({ crewId: newCrewId }, true);
    },
    [updateFilters]
  );

  const setFruit = useCallback(
    (newFruit?: FruitType) => {
      updateFilters({ fruit: newFruit }, true);
    },
    [updateFilters]
  );

  const setSearch = useCallback(
    (newQ?: string) => {
      updateFilters({ q: newQ }, true);
    },
    [updateFilters]
  );

  const setSort = useCallback(
    (newSort?: WantedSort) => {
      updateFilters({ sort: newSort }, true);
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: false });
  }, [setSearchParams]);

  return {
    filters,
    setPage,
    setSize,
    setStatus,
    setCrewId,
    setFruit,
    setSearch,
    setSort,
    resetFilters,
  };
}
