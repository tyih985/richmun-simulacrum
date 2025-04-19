import { TypographyType } from '@lib/supportedFonts';

export type RuntimeThemeProps = {
  /* white labeled experience */
  default_mode?: 'dark' | 'light';
  allow_switching_modes?: boolean; // default is true
  theme_colors: {
    /**
     * primary: used common elements buttons, links, key highlights
     * supporting: complement primary colour on backgrounds and secondary buttons
     * accent: used for contrasting for emphasis like CTAs, notifications, badges, and interactive elements
     */
    primaryColor: ColorType | VirtualColorType;
    primaryShade?: number | { light: number; dark: number };
    supportingColor?: ColorType | VirtualColorType;
    accentColor?: ColorType | VirtualColorType;

    defaultGradient?: unknown;
  };
  replaceGlobalBackground?: ColorType | VirtualColorType;
  replaceGlobalWhite?: ColorType; // (dangerous) optional off-white color to replace white
  replaceGlobalBlack?: ColorType; // (dangerous) optional off-black color to replace black

  fontFamily?: TypographyType;
  headings?: {
    fontFamily?: string;
    fontWeight?: string;
    // user cannot modify header sizes
  };
  defaultBorderRadius?: string;
};

/**
 * Utility Types
 **/
export type MantineColorType = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export type ColorType =
  | `#${string}` // HEX: #fff, #ffffff
  | `rgb(${number}, ${number}, ${number})` // RGB: rgb(255, 255, 255)
  | `rgba(${number}, ${number}, ${number}, ${number | `${number}.${number}`})` // RGBA: rgba(255, 255, 255, 0.5)
  | `hsl(${number}, ${number}%, ${number}%)` // HSL: hsl(0, 0%, 100%)
  | `hsla(${number}, ${number}%, ${number}%, ${number | `${number}.${number}`})` // HSLA: hsla(0, 0%, 100%, 0.5)
  | `oklch(${number}% ${number} ${number})` // OKLCH: oklch(96.27% 0.0217 238.66)
  | `oklch(${number}% ${number} ${number} / ${number | `${number}.${number}`})`; // OKLCH with alpha: oklch(96.27% 0.0217 238.66 / 0.5)

export type VirtualColorType = {
  light: ColorType;
  dark: ColorType;
};
// need to add support for virtual colors
// | {
//     // colorsTuple needs support for more colors library
//     name: string;
//     light: number;
//     dark: number;
//     /**
//      *  settings for custom generating shades
//      *  - saturation?: number;
//      *  - lightness?: number;
//      */
//   };
