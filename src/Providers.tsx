import { Suspense, FC, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { notifications, Notifications } from '@mantine/notifications';
import { ReactFlowProvider } from '@xyflow/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ConfigProvider } from '@providers/configProvider';
import { ThemeProvider } from '@providers/themeProvider';
import { SessionProvider } from '@providers/sessionProvider';

type ProvidersProps = {
  children: ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // handled by @packages/request
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

export const Providers: FC<ProvidersProps> = ({ children }: ProvidersProps) => (
  <ConfigProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <SessionProvider>
            <Notifications
              position="top-right"
              zIndex={1000}
              limit={5}
              autoClose={3000}
            />
            <ReactFlowProvider>
              <Suspense>{children}</Suspense>
            </ReactFlowProvider>
          </SessionProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ConfigProvider>
);
