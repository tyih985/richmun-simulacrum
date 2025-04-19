import { CustomThemeContext } from '@context/theme';
import { useContext } from 'react';

export const useCustomTheme = () => {
  return useContext(CustomThemeContext);
};
