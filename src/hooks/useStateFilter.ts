"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ============================================
// Type Definitions
// ============================================

type FilterValue = string | number | null | undefined;

type FilterState<T extends string> = Partial<Record<T, string>>;

export interface StateFilterOptions {
  /** Debounce delay in milliseconds */
  debounce?: number;

  /** Reset pagination to page 1 when filter changes */
  resetPage?: boolean;
}

export interface StateFilterConfig<T extends string> {
  /** Key used for pagination */
  paginationKey?: T;

  /** Default debounce delay for all updates */
  defaultDebounce?: number;

  /** Initial filter values */
  initialValues?: Partial<Record<T, FilterValue>>;
}

export interface StateClearAllOptions<T extends string> {
  /** Keys to exclude from clearing */
  exclude?: ReadonlyArray<T>;
}

const BATCH_KEY = "___global_batch_update___";

// ============================================
// Helpers
// ============================================

function normalizeFilters<T extends string>(
  values: Partial<Record<T, FilterValue>>,
): FilterState<T> {
  const result: FilterState<T> = {};

  const entries = Object.entries(values) as [T, FilterValue][];

  entries.forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      result[key] = String(value);
    }
  });

  return result;
}

// ============================================
// Main Hook
// ============================================

/**
 * A reusable hook for managing local/state-based filters.
 *
 * Features:
 * - Immediate UI updates
 * - Debounced committed filter state
 * - Batch filter updates
 * - Pagination reset
 * - Multi-select toggle
 * - Clear all filters
 * - Pending update state
 *
 * `draftFilters` / read helpers:
 *   Immediate UI state.
 *
 * `filters`:
 *   Stable committed state intended for TanStack Query.
 */
export const useStateFilter = <T extends string = string>(
  config: StateFilterConfig<T> = {},
) => {
  const {
    paginationKey = "page" as T,
    defaultDebounce = 0,
    initialValues = {},
  } = config;

  // Immediate UI state
  const [draftFilters, setDraftFilters] = useState<FilterState<T>>(() =>
    normalizeFilters(initialValues),
  );

  // Committed state for API / TanStack Query
  const [filters, setFilters] = useState<FilterState<T>>(() =>
    normalizeFilters(initialValues),
  );

  const draftFiltersRef = useRef(draftFilters);
  const filtersRef = useRef(filters);

  const timeoutRefs = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  const [pendingKeys, setPendingKeys] = useState<string[]>([]);

  // ============================================
  // Helpers
  // ============================================

  const isEmptyValue = useCallback((value: FilterValue) => {
    return value === null || value === undefined || value === "";
  }, []);

  const isInvalidPagination = useCallback(
    (key: T, value: FilterValue) => {
      if (key !== paginationKey || isEmptyValue(value)) {
        return false;
      }

      const page = Number(value);

      return !Number.isInteger(page) || page < 1;
    },
    [paginationKey, isEmptyValue],
  );

  const applyUpdates = useCallback(
    (
      current: FilterState<T>,
      updates: Partial<Record<T, FilterValue>>,
      resetPage: boolean,
    ) => {
      const next: FilterState<T> = { ...current };

      const entries = Object.entries(updates) as [T, FilterValue][];

      let hasFilterChanged = false;

      entries.forEach(([key, value]) => {
        if (isInvalidPagination(key, value)) return;

        if (isEmptyValue(value)) {
          delete next[key];
        } else {
          next[key] = String(value);
        }

        if (key !== paginationKey) {
          hasFilterChanged = true;
        }
      });

      if (resetPage && hasFilterChanged) {
        next[paginationKey] = "1";
      }

      return next;
    },
    [paginationKey, isEmptyValue, isInvalidPagination],
  );

  const addPendingKey = useCallback((key: string) => {
    setPendingKeys((prev) => {
      if (prev.includes(key)) return prev;

      return [...prev, key];
    });
  }, []);

  const removePendingKey = useCallback((key: string) => {
    setPendingKeys((prev) => prev.filter((item) => item !== key));
  }, []);

  const clearTimer = useCallback(
    (key: string) => {
      if (timeoutRefs.current[key]) {
        clearTimeout(timeoutRefs.current[key]);
        delete timeoutRefs.current[key];
      }

      removePendingKey(key);
    },
    [removePendingKey],
  );

  const clearAllTimers = useCallback(() => {
    Object.values(timeoutRefs.current).forEach(clearTimeout);

    timeoutRefs.current = {};
  }, []);

  const updateDraftFilters = useCallback(
    (
      updates: Partial<Record<T, FilterValue>>,
      resetPage: boolean,
    ) => {
      const next = applyUpdates(
        draftFiltersRef.current,
        updates,
        resetPage,
      );

      draftFiltersRef.current = next;
      setDraftFilters(next);
    },
    [applyUpdates],
  );

  const commitFilters = useCallback(
    (
      updates: Partial<Record<T, FilterValue>>,
      resetPage: boolean,
    ) => {
      const next = applyUpdates(
        filtersRef.current,
        updates,
        resetPage,
      );

      filtersRef.current = next;
      setFilters(next);
    },
    [applyUpdates],
  );

  const scheduleCommit = useCallback(
    (
      key: string,
      updates: Partial<Record<T, FilterValue>>,
      debounce: number,
      resetPage: boolean,
    ) => {
      clearTimer(key);

      const executeUpdate = () => {
        commitFilters(updates, resetPage);

        delete timeoutRefs.current[key];
        removePendingKey(key);
      };

      if (debounce > 0) {
        addPendingKey(key);

        timeoutRefs.current[key] = setTimeout(
          executeUpdate,
          debounce,
        );
      } else {
        executeUpdate();
      }
    },
    [
      clearTimer,
      commitFilters,
      addPendingKey,
      removePendingKey,
    ],
  );

  // ============================================
  // Update Single Filter
  // ============================================

  const updateFilter = useCallback(
    (
      key: T,
      value: FilterValue,
      options: StateFilterOptions | number = {},
    ) => {
      if (isInvalidPagination(key, value)) return;

      const opt =
        typeof options === "number"
          ? { debounce: options }
          : options;

      const {
        debounce = defaultDebounce,
        resetPage = true,
      } = opt;

      const updates = {
        [key]: value,
      } as Partial<Record<T, FilterValue>>;

      // UI updates immediately
      updateDraftFilters(updates, resetPage);

      // API state can be debounced
      scheduleCommit(
        key,
        updates,
        debounce,
        resetPage,
      );
    },
    [
      defaultDebounce,
      isInvalidPagination,
      updateDraftFilters,
      scheduleCommit,
    ],
  );

  // ============================================
  // Update Multiple Filters
  // ============================================

  const updateBatch = useCallback(
    (
      updates: Partial<Record<T, FilterValue>>,
      options: StateFilterOptions | number = {},
    ) => {
      if (Object.keys(updates).length === 0) return;

      const opt =
        typeof options === "number"
          ? { debounce: options }
          : options;

      const {
        debounce = defaultDebounce,
        resetPage = true,
      } = opt;

      updateDraftFilters(updates, resetPage);

      scheduleCommit(
        BATCH_KEY,
        updates,
        debounce,
        resetPage,
      );
    },
    [
      defaultDebounce,
      updateDraftFilters,
      scheduleCommit,
    ],
  );

  // ============================================
  // Toggle Filter - Multi Select
  // ============================================

  const toggleFilter = useCallback(
    (
      key: T,
      value: string,
      options?: StateFilterOptions,
    ) => {
      const currentValue = draftFiltersRef.current[key];

      let values = currentValue
        ? currentValue.split(",").filter(Boolean)
        : [];

      if (values.includes(value)) {
        values = values.filter((item) => item !== value);
      } else {
        values.push(value);
      }

      const finalValue =
        values.length > 0 ? values.join(",") : null;

      updateFilter(key, finalValue, options);
    },
    [updateFilter],
  );

  // ============================================
  // Clear All Filters
  // ============================================

  const clearAll = useCallback(
    (options: StateClearAllOptions<T> = {}) => {
      const { exclude = [] } = options;

      clearAllTimers();
      setPendingKeys([]);

      const preserveExcluded = (
        current: FilterState<T>,
      ): FilterState<T> => {
        const next: FilterState<T> = {};

        exclude.forEach((key) => {
          const value = current[key];

          if (value !== undefined) {
            next[key] = value;
          }
        });

        return next;
      };

      const nextDraft = preserveExcluded(
        draftFiltersRef.current,
      );

      const nextFilters = preserveExcluded(
        filtersRef.current,
      );

      draftFiltersRef.current = nextDraft;
      filtersRef.current = nextFilters;

      setDraftFilters(nextDraft);
      setFilters(nextFilters);
    },
    [clearAllTimers],
  );

  // ============================================
  // Read Methods
  // ============================================

  const getFilter = useCallback(
    (key: T, defaultValue = "") => {
      return draftFilters[key] ?? defaultValue;
    },
    [draftFilters],
  );

  const getArrayFilter = useCallback(
    (key: T) => {
      const value = draftFilters[key];

      return value
        ? value.split(",").filter(Boolean)
        : [];
    },
    [draftFilters],
  );

  const isSelected = useCallback(
    (key: T, value: string) => {
      const currentValue = draftFilters[key];

      return currentValue
        ? currentValue.split(",").includes(value)
        : false;
    },
    [draftFilters],
  );

  const getAllFilters = useCallback(() => {
    return { ...draftFilters };
  }, [draftFilters]);

  const isFilterActive = useCallback(
    (keys?: ReadonlyArray<T>) => {
      if (keys && keys.length > 0) {
        return keys.some(
          (key) => draftFilters[key] !== undefined,
        );
      }

      return Object.keys(draftFilters).some(
        (key) => key !== paginationKey,
      );
    },
    [draftFilters, paginationKey],
  );

  const getActiveCount = useCallback(
    (keys?: ReadonlyArray<T>) => {
      const activeKeys =
        keys ??
        (Object.keys(draftFilters).filter(
          (key) => key !== paginationKey,
        ) as T[]);

      return activeKeys.filter(
        (key) => draftFilters[key] !== undefined,
      ).length;
    },
    [draftFilters, paginationKey],
  );

  // ============================================
  // Pending State
  // ============================================

  const visiblePendingKeys = useMemo(
    () =>
      pendingKeys.filter(
        (key) => key !== BATCH_KEY,
      ) as T[],
    [pendingKeys],
  );

  const isPendingKey = useCallback(
    (key: T) => pendingKeys.includes(key),
    [pendingKeys],
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(
        clearTimeout,
      );
    };
  }, []);

  return {
    // Committed filters — use with TanStack Query
    filters,

    // Immediate UI state
    draftFilters,

    // Update methods
    updateFilter,
    updateBatch,
    toggleFilter,
    clearAll,

    // Read methods
    getFilter,
    getArrayFilter,
    isSelected,
    getAllFilters,

    // Status methods
    isFilterActive,
    getActiveCount,

    // Pending state
    isPending: pendingKeys.length > 0,
    pendingKeys: visiblePendingKeys,
    isPendingKey,
  };
};