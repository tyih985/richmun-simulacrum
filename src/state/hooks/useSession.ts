import { SessionContext } from '@context/sessionContext';
import { useContext } from 'react';

export const useSession = () => {
  return useContext(SessionContext);
};
