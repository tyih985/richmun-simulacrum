import { ReactNode } from 'react';

import { getConfig } from '@runtime';
import { ConfigContext } from '@context/configContext';

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const config = getConfig();

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};
