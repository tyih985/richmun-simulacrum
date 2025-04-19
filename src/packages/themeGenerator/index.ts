/**
 * this package deals with the conversion between the environment config theme
 * and the runtime settings that combine into the Mantine theme settings.
 * At the barebones, it should take in values and return the mantine theme
 */

import {
  createTheme,
  MantineColorShade,
  MantineColorsTuple,
  MantinePrimaryShade,
  MantineThemeOverride,
  virtualColor,
} from '@mantine/core';

import type { RuntimeThemeProps } from './types';
import { DEFAULT_THEME_SIZES } from './constants';
import {
  generateAccentColor,
  generateSupportingColor,
  handleSecondaryColor,
  resolveColor,
} from './utils';
import {
  DEFAULT_BODY_FONT,
  DEFAULT_HEADER_FONT,
  DEFAULT_MONOSPACE_FONT,
} from '@lib/supportedFonts';

export type { RuntimeThemeProps } from './types';

export const generateMantineTheme = (
  runtimeTheme: RuntimeThemeProps,
): MantineThemeOverride => {
  const primaryColor = runtimeTheme.theme_colors.primaryColor;
  const colors = {
    ...resolveColor('primary', primaryColor),
    ...handleSecondaryColor(
      'supporting',
      primaryColor,
      runtimeTheme.theme_colors.supportingColor,
      generateSupportingColor,
    ),
    ...handleSecondaryColor(
      'accent',
      primaryColor,
      runtimeTheme.theme_colors.accentColor,
      generateAccentColor,
    ),
    ...(runtimeTheme.replaceGlobalBackground
      ? resolveColor('background', runtimeTheme.replaceGlobalBackground)
      : {
          background: virtualColor({
            // this default is required because global.css redirects the background color
            name: 'background',
            light: `--mantine-color-body`,
            dark: `--mantine-color-body`,
          }),
        }),
  } as Record<string, MantineColorsTuple>;

  if (runtimeTheme.replaceGlobalBlack || runtimeTheme.replaceGlobalWhite)
    console.warn(
      'custom theme is using a dangerously set global color override on white/black. It is used at multiple places while keeping accessibility in mind.',
    );

  if (runtimeTheme.replaceGlobalBackground)
    console.warn(
      'custom theme is using a dangerously set global color override for the default background color.',
    );

  const theme: MantineThemeOverride = {
    ...DEFAULT_THEME_SIZES,

    primaryColor: 'primary', // only the key
    primaryShade:
      (runtimeTheme.theme_colors.primaryShade as
        | MantineColorShade
        | MantinePrimaryShade) ?? 6, // Default to shade 6
    defaultRadius: runtimeTheme.defaultBorderRadius ?? 'sm',
    fontFamily: `${runtimeTheme.fontFamily ?? DEFAULT_BODY_FONT}, sans-serif`,
    fontFamilyMonospace: `${DEFAULT_MONOSPACE_FONT}, monospace`,
    headings: {
      fontFamily: `${runtimeTheme.headings?.fontFamily ?? DEFAULT_HEADER_FONT}, sans-serif`,
      fontWeight: runtimeTheme.headings?.fontWeight ?? '700',
    },
    colors: {
      ...colors,
    },
    ...(runtimeTheme.replaceGlobalBlack && { black: runtimeTheme.replaceGlobalBlack }),
    ...(runtimeTheme.replaceGlobalWhite && { black: runtimeTheme.replaceGlobalWhite }),

    defaultGradient: {
      from: 'primary',
      to: 'supporting',
      deg: 45,
    },
  };

  return createTheme(theme);
};
