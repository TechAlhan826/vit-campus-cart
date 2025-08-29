import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { APIResponse } from '@/types';

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
    config: RequestInit = {}
  ): Promise<APIResponse<T> | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        ...config,
      });

      let data: APIResponse<T>;
      
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response format');
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP ${response.status}`);
      }

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
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMsg);

      if (showErrorToast) {
        toast({
          title: "Error",
          description: errorMessage || errorMsg,
          variant: "destructive",
        });
      }

      // Handle authentication errors
      if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
        window.location.href = '/auth/login';
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, showSuccessToast, showErrorToast, successMessage, errorMessage]);

  const get = useCallback((url: string) => execute(url), [execute]);
  
  const post = useCallback((url: string, data?: any) => 
    execute(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }), [execute]);
  
  const put = useCallback((url: string, data?: any) => 
    execute(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }), [execute]);
  
  const del = useCallback((url: string) => 
    execute(url, { method: 'DELETE' }), [execute]);

  return {
    loading,
    error,
    execute,
    get,
    post,
    put,
    delete: del,
  };
};