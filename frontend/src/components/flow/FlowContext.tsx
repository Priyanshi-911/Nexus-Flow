"use client";

import { createContext, useContext } from "react";

interface FlowContextType {
  isCompact: boolean;
  toggleCompact: () => void;
}

export const FlowContext = createContext<FlowContextType>({
  isCompact: false, // Default to Card View
  toggleCompact: () => {},
});

export const useFlowContext = () => useContext(FlowContext);
