import { createContext } from 'react';
import { MantineThemeOverride } from '@mantine/core';

import { RuntimeThemeProps } from '@packages/themeGenerator';
import { TypographyType } from '@lib/supportedFonts';

type TypographyTargetTypes = 'body' | 'header';

type CustomThemeProvider = {
  fontSize: number;
  currentTheme: MantineThemeOverride;
  customTypography: TypographyType | null;
  customHeaderTypography: TypographyType | null;

  updateTypography: (
    typography: TypographyType | null,
    target?: TypographyTargetTypes,
  ) => void;
  updateFontSize: (percentage: number) => void;
  updateTheme: (newTheming: RuntimeThemeProps) => void;
};

export const CustomThemeContext = createContext<CustomThemeProvider>(
  {} as CustomThemeProvider,
);
