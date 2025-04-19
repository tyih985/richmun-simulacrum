import { ReactNode, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { localStorageColorSchemeManager, MantineProvider } from '@mantine/core';

import { generateMantineTheme, RuntimeThemeProps } from '@packages/themeGenerator';
import {
  DEFAULT_BODY_FONT,
  DEFAULT_HEADER_FONT,
  TypographyType,
} from '@lib/supportedFonts';
import { useConfig } from '@hooks/useConfig';
import { generateGoogleFontsHref } from '@packages/themeGenerator/utils';
import { getConfig } from '@runtime/index';
import { CustomThemeContext } from '@context/theme';

const FONTSIZE_LOCAL_STORAGE_KEY = 'theme:fontsize';
const TYPOGRAPHY_LOCAL_STORAGE_KEY = 'theme:body-typography';
const HEADER_TYPOGRAPHY_LOCAL_STORAGE_KEY = 'theme:header-typography';
const COLOR_SCHEME_LOCALSTORAGE_KEY = 'my-app-color-scheme';
const colorSchemeManager = localStorageColorSchemeManager({
  key: COLOR_SCHEME_LOCALSTORAGE_KEY,
});

type ThemeProviderProps = {
  children: ReactNode;
};

type TypographyTargetTypes = 'body' | 'header';

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const config = useConfig();
  const defaultColorScheme = config.default_mode ?? undefined;
  const [currentTheme, setCurrentTheme] = useState(generateMantineTheme(config));
  const [customTypography, setCustomTypography] = useState<TypographyType | null>(
    localStorage.getItem(TYPOGRAPHY_LOCAL_STORAGE_KEY) ?? null,
  );
  const [customHeaderTypography, setCustomHeaderTypography] =
    useState<TypographyType | null>(
      localStorage.getItem(HEADER_TYPOGRAPHY_LOCAL_STORAGE_KEY) ?? null,
    );
  const [fontSize, setFontSize] = useState<number>(100);

  useEffect(() => {
    if (customTypography !== null) updateTypography(customTypography, 'body');
    if (customHeaderTypography !== null)
      updateTypography(customHeaderTypography, 'header');

    const persistingFontsize = Number(localStorage.getItem(FONTSIZE_LOCAL_STORAGE_KEY));
    if (persistingFontsize) updateFontSize(persistingFontsize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFontSize = (scale: number) => {
    setFontSize(scale);
    localStorage.setItem(FONTSIZE_LOCAL_STORAGE_KEY, String(scale));
    document.documentElement.style.fontSize = `${scale}%`;
  };

  const updateTypography = async (
    passTypography: TypographyType | null,
    target?: TypographyTargetTypes,
  ) => {
    const newTypography = getTypography('body', target, passTypography, customTypography);
    const newHeaderTypography = getTypography(
      'header',
      target,
      passTypography,
      customHeaderTypography,
    );
    setCustomTypography(newTypography);
    setCustomHeaderTypography(newHeaderTypography);
    localStorage.setItem(TYPOGRAPHY_LOCAL_STORAGE_KEY, newTypography);
    localStorage.setItem(HEADER_TYPOGRAPHY_LOCAL_STORAGE_KEY, newHeaderTypography);
    setCurrentTheme({
      ...generateMantineTheme(config),
      fontFamily: `${newTypography}, sans-serif`,
      headings: { fontFamily: `${newHeaderTypography}, sans-serif` },
    });
  };

  const updateTheme = (newTheming: RuntimeThemeProps) =>
    setCurrentTheme(generateMantineTheme({ ...config, ...newTheming }));

  return (
    <CustomThemeContext.Provider
      value={{
        fontSize,
        currentTheme,
        customTypography,
        customHeaderTypography,
        updateTheme,
        updateFontSize,
        updateTypography,
      }}
    >
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href={generateGoogleFontsHref()}
          rel="stylesheet"
          referrerPolicy="no-referrer"
        />
      </Helmet>
      <MantineProvider
        theme={currentTheme}
        colorSchemeManager={colorSchemeManager}
        defaultColorScheme={defaultColorScheme}
      >
        {children}
      </MantineProvider>
    </CustomThemeContext.Provider>
  );
};

const getTypography = (
  type: TypographyTargetTypes,
  target: TypographyTargetTypes | undefined,
  passTypography: TypographyType | null,
  oldTypography: TypographyType | null,
): TypographyType => {
  const config = getConfig();
  const defaultBodyFont = config.fontFamily ?? DEFAULT_BODY_FONT;
  const defaultHeaderFont = config.headings?.fontFamily ?? DEFAULT_HEADER_FONT;
  const shouldUpdateType = target === undefined || target === type;
  const shouldResetToDefault = passTypography === null;
  const defaultTypography = type === 'header' ? defaultHeaderFont : defaultBodyFont;

  return passTypography && shouldUpdateType
    ? passTypography.replace(' ', '+')
    : shouldResetToDefault
      ? defaultTypography
      : (oldTypography ?? defaultTypography);
};
