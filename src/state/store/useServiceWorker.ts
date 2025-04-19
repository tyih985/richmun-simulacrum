import { useState, useEffect, useDeferredValue } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';

export const useServiceWorker = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const deferredUpdatePrompt = useDeferredValue(showUpdatePrompt);

  useEffect(() => {
    registerSW({
      immediate: true, // immediately register on page load
      onNeedRefresh: () => setShowUpdatePrompt(true),
      onOfflineReady: () => console.log('App is ready to work offline.'),
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      navigator.serviceWorker.getRegistration().then((reg) => reg?.update());
    }, 1 * 60 * 1000); // every N minutes
    return () => clearInterval(interval);
  }, []);

  const applyUpdate = () => {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        setShowUpdatePrompt(false);
        const params = new URLSearchParams(location.search);
        const existingParams = params.toString();
        // trick the app into seeing a new route, in order to reset index.html
        navigate(
          `${location.pathname}?${existingParams ? `${existingParams}&` : ''}cb=${Date.now()}`,
          { replace: true },
        );
      } else {
        console.log('No waiting service worker to update.');
      }
    });
  };

  // remove the new route param from the url and history to restore original
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('cb')) {
      params.delete('cb');
      const newSearch = params.toString();
      const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
      navigate(newPath, { replace: true });
    }
  }, [location, navigate]);

  const checkForUpdates = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration
            .update()
            .then(() => console.log('Service worker update check complete.'))
            .catch((error) =>
              console.error('Service worker update check failed:', error),
            );
        } else {
          console.log('No service worker registration found.');
        }
      });
    }
  };

  return { showUpdatePrompt: deferredUpdatePrompt, applyUpdate, checkForUpdates };
};
