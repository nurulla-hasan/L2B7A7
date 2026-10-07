"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type FilterValue = string | number | null | undefined;

type FilterState<T extends string> = Partial<Record<T, string>>;

export interface StateFilterOptions {
  /** Debounce delay in milliseconds */
  debounce?: number;

  /** Reset pagination to page 1 when filter changes */
  resetPage?: boolean;
}

export interface StateFilterConfig<T extends string> {
  /** Pagination key */
  paginationKey?: T;

  /** Default debounce delay */
  defaultDebounce?: number;

  /** Initial filter values */
  initialValues?: Partial<Record<T, FilterValue>>;
}

export interface StateClearAllOptions<T extends string> {
  /** Keys to preserve while clearing */
  exclude?: ReadonlyArray<T>;
}

const BATCH_KEY = "___global_batch_update___";

function normalizeFilters<T extends string>(
  values: Partial<Record<T, FilterValue>>
): FilterState<T> {
  const result: FilterState<T> = {};

  Object.entries(values).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      result[key as T] = String(value);
    }
  });

  return result;
}

export function useStateFilter<T extends string = string>(
  config: StateFilterConfig<T> = {}
) {
  const {
    paginationKey = "page" as T,
    defaultDebounce = 0,
    initialValues = {},
  } = config;

  /*
   * draftFilters:
   * UI immediately sees these values.
   *
   * filters:
   * TanStack Query should use these.
   * Debounced values reach here after debounce.
   */
  const [draftFilters, setDraftFilters] = useState<FilterState<T>>(() =>
    normalizeFilters(initialValues)
  );

  const [filters, setFilters] = useState<FilterState<T>>(() =>
    normalizeFilters(initialValues)
  );

  const draftRef = useRef(draftFilters);
  const filtersRef = useRef(filters);

  const timeoutRefs = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  const [pendingKeys, setPendingKeys] = useState<string[]>([]);

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
    [paginationKey, isEmptyValue]
  );

  const applyUpdates = useCallback(
    (
      current: FilterState<T>,
      updates: Partial<Record<T, FilterValue>>,
      resetPage: boolean
    ) => {
      const next: FilterState<T> = { ...current };

      let hasFilterChanged = false;

      const entries = Object.entries(updates) as [T, FilterValue][];

      entries.forEach(([key, value]) => {
        if (isInvalidPagination(key, value)) {
          return;
        }

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
    [paginationKey, isEmptyValue, isInvalidPagination]
  );

  const updateDraft = useCallback(
    (
      updates: Partial<Record<T, FilterValue>>,
      resetPage: boolean
    ) => {
      const next = applyUpdates(
        draftRef.current,
        updates,
        resetPage
      );

      draftRef.current = next;
      setDraftFilters(next);
    },
    [applyUpdates]
  );

  const commitFilters = useCallback(
    (
      updates: Partial<Record<T, FilterValue>>,
      resetPage: boolean
    ) => {
      const next = applyUpdates(
        filtersRef.current,
        updates,
        resetPage
      );

      filtersRef.current = next;
      setFilters(next);
    },
    [applyUpdates]
  );

  const addPendingKey = useCallback((key: string) => {
    setPendingKeys((prev) => {
      if (prev.includes(key)) {
        return prev;
      }

      return [...prev, key];
    });
  }, []);

  const removePendingKey = useCallback((key: string) => {
    setPendingKeys((prev) =>
      prev.filter((item) => item !== key)
    );
  }, []);

  const clearTimer = useCallback(
    (key: string) => {
      if (timeoutRefs.current[key]) {
        clearTimeout(timeoutRefs.current[key]);
        delete timeoutRefs.current[key];
      }

      removePendingKey(key);
    },
    [removePendingKey]
  );

  const clearAllTimers = useCallback(() => {
    Object.values(timeoutRefs.current).forEach(clearTimeout);
    timeoutRefs.current = {};
  }, []);

  const scheduleCommit = useCallback(
    (
      timerKey: string,
      updates: Partial<Record<T, FilterValue>>,
      debounce: number,
      resetPage: boolean
    ) => {
      clearTimer(timerKey);

      const execute = () => {
        commitFilters(updates, resetPage);

        delete timeoutRefs.current[timerKey];

        removePendingKey(timerKey);
      };

      if (debounce > 0) {
        addPendingKey(timerKey);

        timeoutRefs.current[timerKey] = setTimeout(
          execute,
          debounce
        );

        return;
      }

      execute();
    },
    [
      clearTimer,
      commitFilters,
      addPendingKey,
      removePendingKey,
    ]
  );

  const updateFilter = useCallback(
    (
      key: T,
      value: FilterValue,
      options: StateFilterOptions | number = {}
    ) => {
      if (isInvalidPagination(key, value)) {
        return;
      }

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
      updateDraft(updates, resetPage);

      // API/query state can be debounced
      scheduleCommit(
        key,
        updates,
        debounce,
        resetPage
      );
    },
    [
      defaultDebounce,
      isInvalidPagination,
      updateDraft,
      scheduleCommit,
    ]
  );

  const updateBatch = useCallback(
    (
      updates: Partial<Record<T, FilterValue>>,
      options: StateFilterOptions | number = {}
    ) => {
      if (Object.keys(updates).length === 0) {
        return;
      }

      const opt =
        typeof options === "number"
          ? { debounce: options }
          : options;

      const {
        debounce = defaultDebounce,
        resetPage = true,
      } = opt;

      updateDraft(updates, resetPage);

      scheduleCommit(
        BATCH_KEY,
        updates,
        debounce,
        resetPage
      );
    },
    [
      defaultDebounce,
      updateDraft,
      scheduleCommit,
    ]
  );

  const toggleFilter = useCallback(
    (
      key: T,
      value: string,
      options?: StateFilterOptions
    ) => {
      const currentValue = draftRef.current[key];

      let values = currentValue
        ? currentValue.split(",").filter(Boolean)
        : [];

      if (values.includes(value)) {
        values = values.filter((item) => item !== value);
      } else {
        values.push(value);
      }

      updateFilter(
        key,
        values.length > 0 ? values.join(",") : null,
        options
      );
    },
    [updateFilter]
  );

  const clearAll = useCallback(
    (options: StateClearAllOptions<T> = {}) => {
      const { exclude = [] } = options;

      clearAllTimers();
      setPendingKeys([]);

      const getNextState = (
        current: FilterState<T>
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

      const nextDraft = getNextState(draftRef.current);
      const nextFilters = getNextState(filtersRef.current);

      draftRef.current = nextDraft;
      filtersRef.current = nextFilters;

      setDraftFilters(nextDraft);
      setFilters(nextFilters);
    },
    [clearAllTimers]
  );

  const getFilter = useCallback(
    (key: T, defaultValue = "") => {
      return draftFilters[key] ?? defaultValue;
    },
    [draftFilters]
  );

  const getArrayFilter = useCallback(
    (key: T) => {
      const value = draftFilters[key];

      return value
        ? value.split(",").filter(Boolean)
        : [];
    },
    [draftFilters]
  );

  const isSelected = useCallback(
    (key: T, value: string) => {
      const currentValue = draftFilters[key];

      return currentValue
        ? currentValue.split(",").includes(value)
        : false;
    },
    [draftFilters]
  );

  const getAllFilters = useCallback(() => {
    return { ...draftFilters };
  }, [draftFilters]);

  const isFilterActive = useCallback(
    (keys?: ReadonlyArray<T>) => {
      if (keys?.length) {
        return keys.some(
          (key) => draftFilters[key] !== undefined
        );
      }

      return Object.keys(draftFilters).some(
        (key) => key !== paginationKey
      );
    },
    [draftFilters, paginationKey]
  );

  const getActiveCount = useCallback(
    (keys?: ReadonlyArray<T>) => {
      const activeKeys =
        keys ??
        (Object.keys(draftFilters).filter(
          (key) => key !== paginationKey
        ) as T[]);

      return activeKeys.filter(
        (key) => draftFilters[key] !== undefined
      ).length;
    },
    [draftFilters, paginationKey]
  );

  const visiblePendingKeys = useMemo(
    () =>
      pendingKeys.filter(
        (key) => key !== BATCH_KEY
      ) as T[],
    [pendingKeys]
  );

  const isPendingKey = useCallback(
    (key: T) => pendingKeys.includes(key),
    [pendingKeys]
  );

  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(
        clearTimeout
      );
    };
  }, []);

  return {
    /*
     * Use this in TanStack queryKey/queryFn.
     * Changes after debounce.
     */
    filters,

    /*
     * Immediate UI state.
     */
    draftFilters,

    // Updates
    updateFilter,
    updateBatch,
    toggleFilter,
    clearAll,

    // Reads
    getFilter,
    getArrayFilter,
    isSelected,
    getAllFilters,

    // Status
    isFilterActive,
    getActiveCount,

    // Pending
    isPending: pendingKeys.length > 0,
    pendingKeys: visiblePendingKeys,
    isPendingKey,
  };
}