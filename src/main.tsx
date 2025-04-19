import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Providers } from './Providers.tsx';
import { RuntimeEnvironmentConfig } from '@runtime/types.ts';

declare const __RUNTIME_CONFIG__: RuntimeEnvironmentConfig;

const initializeApp = () => {
  window.RUNTIME_ENV_CONFIG = __RUNTIME_CONFIG__;
  const container = document.getElementById('root');
  if (!container) throw new Error('Failed to find the root element');

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <Providers>
        <App />
      </Providers>
    </StrictMode>,
  );
};

initializeApp();
