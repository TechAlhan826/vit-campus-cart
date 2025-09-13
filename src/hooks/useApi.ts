import { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { APIResponse } from '@/types';
import axios, { AxiosRequestConfig } from 'axios';

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
      const response = await axios({
        url,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          ...(config.headers || {}),
        },
        ...config,
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
        throw new Error(data.message || data.error || 'Operation failed');
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Network error occurred';
      setError(errorMsg);

      if (showErrorToast) {
        toast({
          title: "Error",
          description: errorMessage || errorMsg,
          variant: "destructive",
        });
      }

      // Handle authentication errors
      if (err?.response?.status === 401 || errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
        window.location.href = '/auth/login';
      }

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