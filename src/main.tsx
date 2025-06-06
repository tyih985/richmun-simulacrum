import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Providers } from './Providers.tsx';
import { RuntimeEnvironmentConfig } from '@runtime/types.ts';

declare const __RUNTIME_CONFIG__: RuntimeEnvironmentConfig;
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { notifications } from '@mantine/notifications';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const initializeApp = () => {
  window.RUNTIME_ENV_CONFIG = __RUNTIME_CONFIG__;
  const container = document.getElementById('root');
  if (!container) throw new Error('Failed to find the root element');

  window.addEventListener('online', () => {
    console.log('online');
    notifications.hide('offline-notification');
    notifications.show({
      id: 'online-notification',
      title: "You're back online!",
      message: "We've synced up your changes.",
      autoClose: 3000,
    });
  });

  window.addEventListener('offline', () => {
    console.log('offline');
    notifications.hide('online-notification');
    notifications.show({
      id: 'offline-notification',
      title: 'You are currently offline.',
      message:
        "You can still use certain features of the app, and we'll sync up your changes when you reconnect!",
      autoClose: false,
    });
  });

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
