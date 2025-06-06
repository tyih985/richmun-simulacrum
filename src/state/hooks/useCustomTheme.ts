import { useContext } from 'react';
import { CustomThemeContext } from '@context/customTheme';

export const useCustomTheme = () => {
  return useContext(CustomThemeContext);
};
