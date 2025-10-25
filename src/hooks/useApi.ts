import { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { APIResponse } from '@/types';
import axios from '@/lib/axios';
import { AxiosRequestConfig } from 'axios';

interface UseApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export const useApi = <T = any>(options: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage,
    errorMessage,
  } = options;

  const execute = useCallback(async (
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<APIResponse<T> | null> => {
    setLoading(true);
    setError(null);

    try {
      // Use relative URL paths to ensure Vite proxy intercepts in dev mode
      // e.g., '/api/products' will be proxied to http://localhost:5000/api/products
      const response = await axios({
        ...config,
        url, // Must be relative path like '/api/...'
        headers: {
          'Content-Type': 'application/json',
          ...(config.headers || {}),
        },
      });

      const data: APIResponse<T> = response.data;

      if (data.success) {
        if (showSuccessToast && successMessage) {
          toast({
            title: "Success",
            description: successMessage,
          });
        }
        return data;
      } else {
        // Backend returned success: false
        const errorMsg = data.message || data.error || 'Operation failed';
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      // Extract meaningful error message from backend
      let errorMsg = 'Network error occurred';
      
      if (err?.response?.data) {
        // Backend sent structured error
        errorMsg = err.response.data.msg || 
                   err.response.data.message || 
                   err.response.data.error || 
                   err.response.data.errors?.[0]?.msg ||
                   `Error ${err.response.status}: ${err.response.statusText}`;
      } else if (err?.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);

      if (showErrorToast) {
        toast({
          title: "Error",
          description: errorMessage || errorMsg,
          variant: "destructive",
        });
      }

      // DON'T auto-redirect on 401 - let AuthContext handle it
      // The AuthContext already checks token validity on mount
      // Auto-redirecting here causes premature logouts
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, showSuccessToast, showErrorToast, successMessage, errorMessage]);

  const get = useCallback((url: string, config?: AxiosRequestConfig) => execute(url, { method: 'GET', ...(config || {}) }), [execute]);

  const post = useCallback((url: string, data?: any, config?: AxiosRequestConfig) =>
    execute(url, { method: 'POST', data, ...(config || {}) }), [execute]);

  const put = useCallback((url: string, data?: any, config?: AxiosRequestConfig) =>
    execute(url, { method: 'PUT', data, ...(config || {}) }), [execute]);

  const del = useCallback((url: string, config?: AxiosRequestConfig) =>
    execute(url, { method: 'DELETE', ...(config || {}) }), [execute]);

  return useMemo(() => ({
    loading,
    error,
    execute,
    get,
    post,
    put,
    delete: del,
  }), [loading, error, execute, get, post, put, del]);
};