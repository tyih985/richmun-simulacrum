import { RuntimeEnvironmentConfig, EnvironmentConfig } from './types';
import { FirebaseConfig } from './types';

export type { EnvironmentConfig } from './types';

const prodFirebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_AUTH_DOMAIN ?? '',
  databaseURL: import.meta.env.VITE_DATABASE_URL ?? '',
  projectId: import.meta.env.VITE_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_APP_ID ?? '',
} as FirebaseConfig;

declare global {
  interface Window {
    RUNTIME_ENV_CONFIG: RuntimeEnvironmentConfig;
  }
}

// allows for lazy loading?
let config: EnvironmentConfig | null = null;
declare const __RUNTIME_CONFIG__: RuntimeEnvironmentConfig;

export const getConfig = (): EnvironmentConfig => {
  if (!window.RUNTIME_ENV_CONFIG) {
    console.warn('window.RUNTIME_ENV_CONFIG was not set, attempting to populate');
    window.RUNTIME_ENV_CONFIG = __RUNTIME_CONFIG__;
  }
  const runtimeConfig = window.RUNTIME_ENV_CONFIG;

  config = {
    firebase: prodFirebaseConfig as FirebaseConfig,
    cloud_functions_root: CLOUD_FUNCTIONS_ROOT as string,
    firebase_app_root: FIREBASE_DEPLOYMENT as string,
    ...runtimeConfig,
  };
  return config;
};

/**
 * consider a way to check that all images are a valid size
 * i.e. favicon should be 48 x 48
 **/

const FIREBASE_DEPLOYMENT = prodFirebaseConfig
  ? `https://${prodFirebaseConfig.projectId}.web.app`
  : '';

const isEmulated = // should match firebase.json emulator for hosting
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1') &&
  window.location.port === '5000';

const CLOUD_FUNCTIONS_ROOT = isEmulated
  ? `http://127.0.0.1:5000/api/v1` // should match port in firebase.json
  : prodFirebaseConfig
    ? `https://${prodFirebaseConfig.projectId}.web.app/api/v1`
    : '';
