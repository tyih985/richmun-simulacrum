export type TypographyType =
  | (typeof SUPPORTED_GOOGLE_FONTS)[number]
  | (typeof NOT_GOOGLE_FONTS)[number];

export const SUPPORTED_GOOGLE_FONTS = ['Philosopher', 'Josefin Sans', 'Lato'];
export const SUPPORTED_CUSTOM_FONTS = ['OpenDyslexic']; // need to add to ./extra-fonts.css

export const DEFAULT_MONOSPACE_FONT = 'Courier';
export const DEFAULT_BODY_FONT = 'Inter';
export const DEFAULT_HEADER_FONT = 'Roboto';
export const NOT_GOOGLE_FONTS = [
  ...SUPPORTED_CUSTOM_FONTS,
  DEFAULT_BODY_FONT,
  DEFAULT_HEADER_FONT,
];
