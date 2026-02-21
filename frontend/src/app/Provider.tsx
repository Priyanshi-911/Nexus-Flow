"use client";

import React, { useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// 1. Setup the Wagmi Config
const config = getDefaultConfig({
  appName: "Nexus Flow",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // Get a free one at cloud.walletconnect.com
  chains: [sepolia],
  ssr: true, // 🟢 VERY IMPORTANT for Next.js App Router
});

export function Providers({ children }: { children: React.ReactNode }) {
  // 2. Initialize QueryClient inside the component to ensure it is unique per request
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
