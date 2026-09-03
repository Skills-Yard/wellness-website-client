"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/src/lib/queryClient";
import AppToastContainer from "@/src/components/ui/AppToastContainer";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <AppToastContainer />
    </QueryClientProvider>
  );
}
