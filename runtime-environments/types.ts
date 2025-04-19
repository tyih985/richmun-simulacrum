import type { RuntimeThemeProps } from '../src/packages/themeGenerator';

export type RuntimeEnvironmentConfig = RuntimeThemeProps & {
  short_name: string;
  long_name: string;
  subtitle?: string;
  description?: string;

  /* seo and app-level customization */
  support_email: string;
  site_title: string;
  favicon_url: string;
  logo_url: string; // for main nav
  logo_mono_url: string; // for watermarks

  icon_192_url: string; // required for manifest download
  icon_512_url: string; // required for manifest download

  screenshots?: Record<Partial<ScreenshotSizeKeys>, string>;
};

/**
 * images are auto defined by the dimension in the key and image extension in the url
 * keywords for form_factor and platform are also matched by regex into the manifest.json
 */
type ScreenshotSizeKeys =
  | 'wide_1280x720'
  | 'narrow_720x1280'
  | 'tablet_1200x1920'
  | 'mobile_iphone_375x812'
  | 'mobile_android_360x800'
  | string;

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  databaseURL?: string; // real-time database
  firestoreName?: string; // if not (default)
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};
export type StaticEnvironmentConfig = {
  // api_root: string;
  // api_billing: string;
  cloud_functions_root: string;
  firebase_app_root: string;
  firebase: FirebaseConfig;
};
export type EnvironmentConfig = RuntimeEnvironmentConfig & StaticEnvironmentConfig;
