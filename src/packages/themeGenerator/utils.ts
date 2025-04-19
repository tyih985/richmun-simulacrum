import chroma from 'chroma-js';
import { generateColors } from '@mantine/colors-generator';
import { MantineColorsTuple, virtualColor } from '@mantine/core';

import { SUPPORTED_GOOGLE_FONTS } from '@lib/supportedFonts';
import { getConfig } from '@runtime/index';

import { ColorType, VirtualColorType } from './types';
import { DEFAULT_ERROR_COLOR } from './constants';

export const areColorsTooSimilar = (
  color1: string,
  color2: string,
  threshold = 10,
): boolean => {
  return chroma.distance(color1, color2) < threshold;
};

export const handleSecondaryColor = (
  name: string,
  primaryColor: ColorType | VirtualColorType,
  colorConfig: undefined | ColorType | VirtualColorType,
  variantGenerator: (color: string) => ColorType,
) => {
  const primaryIsVirtual =
    typeof primaryColor === 'object' && 'dark' in primaryColor && 'light' in primaryColor;
  return colorConfig
    ? resolveColor(name, colorConfig, variantGenerator)
    : primaryIsVirtual
      ? resolveColor(
          name,
          {
            light: (primaryColor as VirtualColorType).light,
            dark: (primaryColor as VirtualColorType).dark,
          },
          variantGenerator,
        )
      : resolveColor(name, variantGenerator(primaryColor));
};

export const resolveColor = (
  name: string,
  colorConfig: ColorType | VirtualColorType,
  variantGenerator?: (color: string) => ColorType,
): Record<string, MantineColorsTuple> => {
  if (
    typeof colorConfig === 'object' &&
    'light' in colorConfig &&
    'dark' in colorConfig
  ) {
    return generateVirtualColor(
      name,
      colorConfig.light,
      colorConfig.dark,
      variantGenerator,
    );
  }
  // else if string type
  return {
    [name]: generateColors(colorConfig as string) as MantineColorsTuple,
  };
};

export const generateVirtualColor = (
  name: string,
  lightSource: string,
  darkSource: string,
  transform?: (color: string) => string,
): Record<string, MantineColorsTuple> => {
  const lightColor = generateColors(transform ? transform(lightSource) : lightSource);
  const darkColor = generateColors(transform ? transform(darkSource) : darkSource);

  const colors = {
    [`${name}-light`]: lightColor,
    [`${name}-dark`]: darkColor,
    [name]: virtualColor({
      name,
      light: `${name}-light`,
      dark: `${name}-dark`,
    }),
  };

  return colors;
};

export const generateSupportingColor = (primaryColor: string): ColorType => {
  const MIN_CONTRAST = 2.5; // WCAG AA minimum contrast ratio
  const adjustmentStep = 0.05; // Step size for luminance adjustments
  let supportingColor = chroma(primaryColor);
  let currentContrast = chroma.contrast(primaryColor, supportingColor);

  // Start with a slightly brighter or duller color
  const isBright = supportingColor.luminance() > 0.5;
  supportingColor = isBright
    ? supportingColor.darken(0.2) // If the color is bright, dull it
    : supportingColor.brighten(0.2); // If the color is dark, brighten it

  // Incrementally adjust the luminance for sufficient contrast
  while (currentContrast < MIN_CONTRAST) {
    supportingColor = isBright
      ? supportingColor.darken(adjustmentStep) // Continue dulling if initially bright
      : supportingColor.brighten(adjustmentStep); // Continue brightening if initially dark

    // Recalculate contrast
    currentContrast = chroma.contrast(primaryColor, supportingColor);

    // Stop if the luminance reaches limits
    if (supportingColor.luminance() >= 1 || supportingColor.luminance() <= 0) {
      break;
    }
  }

  return supportingColor.hex() as ColorType; // Return the new supporting color in HEX format
};

export const generateAccentColor = (primaryColor: string): ColorType => {
  // Generate complementary color
  let accent = chroma(primaryColor).set(
    'hsl.h',
    (chroma(primaryColor).get('hsl.h') + 180) % 360,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_hue, saturation, lightness] = chroma(primaryColor).hsl();

  // Adjust saturation if it's too low
  if (saturation < 0.5) {
    accent = chroma(accent).set('hsl.s', Math.min(1, saturation + (0.5 - saturation)));
  }

  // Adjust lightness
  if (lightness < 0.5) {
    accent = chroma(accent).set('hsl.l', Math.min(1, lightness + (0.5 - lightness)));
  } else if (lightness > 0.7) {
    accent = chroma(accent).set('hsl.l', Math.max(0, lightness - 0.2));
  }

  // Resolve too similar colors
  let adjustedColor = accent;
  while (areColorsTooSimilar(adjustedColor.hex(), DEFAULT_ERROR_COLOR)) {
    // Shift the hue slightly to avoid similarity
    adjustedColor = chroma(adjustedColor).set(
      'hsl.h',
      chroma(adjustedColor).get('hsl.h') + 30,
    );
  }

  return adjustedColor.hex() as ColorType;
};

export const isValidColor = (color: string): boolean => {
  // HEX: #fff, #ffffff
  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
  // RGB: rgb(255, 255, 255)
  const rgbRegex = /^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/;
  // RGBA: rgba(255, 255, 255, 0.5)
  const rgbaRegex = /^rgba\((\d{1,3}), (\d{1,3}), (\d{1,3}), (0|1|0?\.\d+)\)$/;
  // HSL: hsl(0, 0%, 100%)
  const hslRegex = /^hsl\((\d{1,3}), (\d{1,3})%, (\d{1,3})%\)$/;
  // HSLA: hsla(0, 0%, 100%, 0.5)
  const hslaRegex = /^hsla\((\d{1,3}), (\d{1,3})%, (\d{1,3})%, (0|1|0?\.\d+)\)$/;
  // OKLCH: oklch(96.27% 0.0217 238.66)
  const oklchRegex = /^oklch\((\d+(\.\d+)?%) (\d+(\.\d+)?) (\d+(\.\d+)?)\)$/;
  // OKLCH with alpha: oklch(96.27% 0.0217 238.66 / 0.5)
  const oklchAlphaRegex =
    /^oklch\((\d+(\.\d+)?%) (\d+(\.\d+)?) (\d+(\.\d+)?) \/ (0|1|0?\.\d+)\)$/;

  return (
    hexRegex.test(color) ||
    rgbRegex.test(color) ||
    rgbaRegex.test(color) ||
    hslRegex.test(color) ||
    hslaRegex.test(color) ||
    oklchRegex.test(color) ||
    oklchAlphaRegex.test(color)
  );
};

export const generateGoogleFontsHref = (): string => {
  const defaultFontWeights = [400, 700];
  const customFontWeight = getConfig().headings?.fontWeight;
  const fontWeights =
    customFontWeight && !defaultFontWeights.includes(Number(customFontWeight))
      ? [...defaultFontWeights, customFontWeight].sort()
      : defaultFontWeights;
  const weightQuery = fontWeights
    .map((weight) => `0,${weight}`)
    .concat(fontWeights.map((weight) => `1,${weight}`))
    .join(';');

  const fontParams = SUPPORTED_GOOGLE_FONTS.map(
    (font) => `${font.replace(/\s+/g, '+')}:ital,wght@${weightQuery}`,
  ).join('&family=');
  return `https://fonts.googleapis.com/css2?family=${fontParams}&display=swap`;
};
