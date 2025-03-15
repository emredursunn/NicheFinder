"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { useEffect } from "react";

// Query Client oluştur
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 48, // 1 gün cache’de tut
      cacheTime: 1000 * 60 * 60 * 48, // 1 gün cache’de sakla
    },
  },
});

export default function ClientQueryProvider({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Cache'i LocalStorage'de saklamak için yapılandır
      const persister = createSyncStoragePersister({
        storage: window.localStorage,
      });
      // Query Client'ı persist (kalıcı) yap
      persistQueryClient({
        queryClient,
        persister,
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
