import { createContext } from 'react';

export type ViewportType = {
  width: number;
  height: number;
};

type FlowViewportContextType = {
  refCallback: (node: HTMLDivElement | null) => void;
  getViewportSize: () => ViewportType;
};

export const ReactFlowViewportContext = createContext<FlowViewportContextType>({
  refCallback: () => undefined,
  getViewportSize: () => undefined as never,
});
