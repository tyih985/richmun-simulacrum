import { useContext } from 'react';
import { ConfigContext } from '@context/config';

export const useConfig = () => {
  return useContext(ConfigContext);
};
