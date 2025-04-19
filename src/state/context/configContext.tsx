import { createContext } from 'react';

import { EnvironmentConfig } from '@runtime';

export const ConfigContext = createContext<EnvironmentConfig>({} as EnvironmentConfig);
