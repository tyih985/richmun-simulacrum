import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

import type { RuntimeEnvironmentConfig } from './runtime-environments/types';

import path from 'path';
import fs from 'fs';

type imageMtd = {
  src: string;
  sizes: string;
  type: string;

  form_factor?: string;
  label?: string;
  platform?: string;
};

// need to use values from the runtime env
export const generateManifestFields = (config: RuntimeEnvironmentConfig) => {
  const icons: imageMtd[] = [];
  const screenshots: imageMtd[] = [];

  addImageEntryFromFieldName(icons, 'favicon_48x48', config.favicon_url);
  addImageEntryFromFieldName(icons, 'icon_192x192', config.icon_192_url);
  addImageEntryFromFieldName(icons, 'icon_512x512', config.icon_512_url);

  // Add screenshots dynamically using regex on field names
  const screenshotFields = Object.entries(config.screenshots || {});
  for (const [field, url] of screenshotFields) {
    addImageEntryFromFieldName(screenshots, field, url as string);
  }

  const themeColor =
    config.theme_colors.primaryColor &&
    typeof config.theme_colors.primaryColor === 'string'
      ? config.theme_colors.primaryColor
      : typeof config.theme_colors.primaryColor === 'object'
        ? !config.default_mode || config.default_mode === 'light'
          ? (config.theme_colors.primaryColor as { light: string; dark: string }).light
          : (config.theme_colors.primaryColor as { light: string; dark: string }).dark
        : '#fff'; // backup
  const backgroundColor =
    config.replaceGlobalBackground && typeof config.replaceGlobalBackground === 'string'
      ? config.replaceGlobalBackground
      : typeof config.replaceGlobalBackground === 'object'
        ? !config.default_mode || config.default_mode === 'light'
          ? (config.replaceGlobalBackground as { light: string; dark: string }).light
          : (config.replaceGlobalBackground as { light: string; dark: string }).dark
        : '#fff'; // backup

  return {
    name: config.long_name,
    short_name: config.short_name,
    description: config.description,

    theme_color: themeColor,
    background_color: backgroundColor,

    icons,
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const brand = env.VITE_CONFIG_KEY || 'default';
  console.log('brand config:', brand);

  const configPath = path.resolve(
    __dirname,
    `runtime-environments/${brand}/runtime.json`,
  );
  const configContent = fs.readFileSync(configPath, 'utf-8');
  const configJson = JSON.parse(configContent); // Optional if you want type checking
  const configString = JSON.stringify(configJson);

  return {
    plugins: [
      react(),
      VitePWA({
        workbox: {
          globPatterns: ['**/*'],
        },
        includeAssets: ['**/*'],
        manifest: {
          display: 'standalone',
          scope: '/',
          start_url: '/',
          ...generateManifestFields(configJson),
        },
      }),
    ],
    define: {
      __RUNTIME_CONFIG__: configString,
      'import.meta.env.BUILD_DATE': JSON.stringify(new Date().toISOString()), // Inject the build timestamp
    },
    resolve: {
      alias: {
        '@features': path.resolve(__dirname, 'src/features'),
        '@components': path.resolve(__dirname, 'src/components'),

        '@context': path.resolve(__dirname, 'src/state/context'),
        '@mutations': path.resolve(__dirname, 'src/state/mutations'),
        '@providers': path.resolve(__dirname, 'src/state/providers'),
        '@store': path.resolve(__dirname, 'src/state/store'),
        '@hooks': path.resolve(__dirname, 'src/state/hooks'),

        '@packages': path.resolve(__dirname, 'src/packages'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@lib': path.resolve(__dirname, 'src/lib'),
        '@types': path.resolve(__dirname, 'src/types'),
        '@runtime': path.resolve(__dirname, 'runtime-environments'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
  };
});

function getImageExtensionType(url: string): string {
  const validImageExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'webp',
    'svg',
    'ico',
    'tiff',
    'tif',
    'heic',
    'heif',
    'avif',
  ];
  const ext = url.split('.').at(-1);
  if (ext && validImageExtensions.includes(ext)) {
    if (ext === 'svg') return 'svg+xml';
    if (ext === 'ico') return 'x-icon';
    if (ext === 'jpg') return 'jpeg';
    if (ext === 'tif') return 'tiff';
    return ext;
  }
  console.error(`image at url ${url} has no valid extension`);
  return 'png';
}

function addImageEntryFromFieldName(
  arr: imageMtd[],
  fieldName: string,
  url: string | undefined,
): void {
  if (!url || typeof url !== 'string') return; // fail silently if invalid

  const dimensionMatch = fieldName.match(/(\d+x\d+)/); // Regex to extract dimensions
  const formFactorKeywordMatch = fieldName.match(/(wide|narrow)/);
  const platformKeywordMatch = fieldName.match(/(desktop|tablet|mobile)/);
  const imageExtension = getImageExtensionType(url);

  if (dimensionMatch) {
    arr.push({
      src: url,
      sizes: dimensionMatch[1], // Extracted dimensions (e.g., "1280x720")
      type: `image/${imageExtension}`,
      ...(formFactorKeywordMatch && { form_factor: formFactorKeywordMatch[1] }),
      ...(platformKeywordMatch && { platform: platformKeywordMatch[1] }),
    });
  } else {
    console.warn(`Field ${fieldName} does not contain valid dimensions.`);
  }
}
