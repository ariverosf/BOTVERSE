"use client"
import { useEffect, useState, useCallback } from "react";

type QueryOptions = {
  data?: unknown;
  params?: { [x: string]: string };
  headers?: HeadersInit;
  skip?: boolean; // para evitar el fetch automático
};

function toSearchParams(params: { [x: string]: string } = {}) {
  const urlSearch = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    urlSearch.append(key, value);
  });
  return urlSearch.toString();
}

export default function useQuery<T>(
  url: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  options?: QueryOptions
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const searchParams = toSearchParams(options?.params);
      const finalUrl = searchParams ? `${url}?${searchParams}` : url;

      const fetchOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      };

      if (["POST", "PUT", "PATCH"].includes(method) && options?.data) {
        fetchOptions.body = JSON.stringify(options.data);
      }

      const response = await fetch(finalUrl, fetchOptions);
      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, method, JSON.stringify(options)]);

  useEffect(() => {
    if (!options?.skip) {
      fetchData();
    }
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
}