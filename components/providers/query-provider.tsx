"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth();
  
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  // Initialize API client with Clerk token getter
  useEffect(() => {
    apiClient.setTokenGetter(async () => {
      if (!isSignedIn) return null;
      return await getToken();
    });
  }, [getToken, isSignedIn]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
