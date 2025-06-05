import { Suspense, FC, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import { ReactFlowProvider } from '@xyflow/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ConfigProvider } from '@context/config';
import { ThemeProvider } from '@context/customTheme';
import { SessionProvider } from '@context/session';
import { CommitteeAccessProvider } from '@context/committeeAccess';

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
            <CommitteeAccessProvider>
              <Notifications
                position="top-right"
                zIndex={1000}
                limit={5}
                autoClose={3000}
              />
              <ReactFlowProvider>
                <Suspense>{children}</Suspense>
              </ReactFlowProvider>
            </CommitteeAccessProvider>
          </SessionProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ConfigProvider>
);
