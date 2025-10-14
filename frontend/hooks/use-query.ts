"use client"
import { useEffect, useState, useCallback, useRef } from "react";
import { ApiException } from "@/lib/api";

// Enhanced query options with better type safety
interface QueryOptions<T = unknown> {
  data?: T;
  params?: Record<string, string>;
  headers?: HeadersInit;
  skip?: boolean;
  retry?: number;
  retryDelay?: number;
  cacheTime?: number; // Cache time in milliseconds
  staleTime?: number; // Stale time in milliseconds
  onSuccess?: (data: T) => void;
  onError?: (error: ApiException) => void;
}

// Cache interface for better data management
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  staleTime: number;
}

// Simple cache implementation
class QueryCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, staleTime: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      staleTime,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isStale = Date.now() - entry.timestamp > entry.staleTime;
    if (isStale) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

// Global cache instance
const queryCache = new QueryCache();

// Enhanced useQuery hook with caching, retry logic, and better error handling
export function useQuery<T>(
  url: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "GET",
  options: QueryOptions<T> = {}
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiException | null>(null);
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate cache key
  const cacheKey = `${method}:${url}:${JSON.stringify(options.params || {})}`;

  // Check cache first for GET requests
  const getCachedData = useCallback((): T | null => {
    if (method === "GET" && !options.skip) {
      return queryCache.get<T>(cacheKey);
    }
    return null;
  }, [method, cacheKey, options.skip]);

  // Set cache data
  const setCachedData = useCallback((data: T) => {
    if (method === "GET") {
      const staleTime = options.staleTime || 5 * 60 * 1000; // 5 minutes default
      queryCache.set(cacheKey, data, staleTime);
    }
  }, [method, cacheKey, options.staleTime]);

  const fetchData = useCallback(async (isRetry = false) => {
    // Check cache first for GET requests
    if (!isRetry && method === "GET") {
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        return;
      }
    }

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const searchParams = options.params ? new URLSearchParams(options.params).toString() : '';
      const finalUrl = searchParams ? `${url}?${searchParams}` : url;

      const fetchOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        signal: abortControllerRef.current.signal,
      };

      if (["POST", "PUT", "PATCH"].includes(method) && options.data) {
        fetchOptions.body = JSON.stringify(options.data);
      }

      const response = await fetch(finalUrl, fetchOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiException(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData.code || 'HTTP_ERROR',
          errorData
        );
      }

      const result = await response.json();
      
      setData(result);
      setCachedData(result);
      options.onSuccess?.(result);
      
    } catch (err) {
      // Handle abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const apiError = err instanceof ApiException ? err : new ApiException(
        'Network error occurred',
        0,
        'NETWORK_ERROR',
        { originalError: err }
      );

      setError(apiError);
      options.onError?.(apiError);

      // Retry logic - only retry if not a network error (backend down)
      const maxRetries = options.retry || 0;
      const retryDelay = options.retryDelay || 1000;

      if (retryCountRef.current < maxRetries && apiError.status !== 0) {
        retryCountRef.current++;
        setTimeout(() => {
          fetchData(true);
        }, retryDelay * retryCountRef.current);
      }
    } finally {
      setLoading(false);
    }
  }, [url, method, getCachedData, setCachedData]);

  // Effect to trigger fetch
  useEffect(() => {
    if (!options.skip) {
      fetchData();
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, options.skip]);

  // Manual refetch function
  const refetch = useCallback(() => {
    retryCountRef.current = 0;
    fetchData();
  }, [fetchData]);

  // Invalidate cache
  const invalidate = useCallback(() => {
    queryCache.delete(cacheKey);
  }, [cacheKey]);

  return { 
    data, 
    error, 
    loading, 
    refetch,
    invalidate,
    isError: !!error,
    isSuccess: !loading && !error && data !== null,
  };
}

// Hook for mutations (POST, PUT, PATCH, DELETE)
export function useMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData) => void;
    onError?: (error: ApiException) => void;
  } = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const mutate = useCallback(async (variables: TVariables) => {
    try {
      setLoading(true);
      setError(null);

      const result = await mutationFn(variables);
      
      setData(result);
      options.onSuccess?.(result);
      
      return result;
    } catch (err) {
      const apiError = err instanceof ApiException ? err : new ApiException(
        'Mutation failed',
        0,
        'MUTATION_ERROR',
        { originalError: err }
      );

      setError(apiError);
      options.onError?.(apiError);
      
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [mutationFn, options]);

  return {
    mutate,
    loading,
    error,
    data,
    isError: !!error,
    isSuccess: !loading && !error && data !== null,
  };
}