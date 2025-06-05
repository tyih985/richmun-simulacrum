import { useContext } from 'react';
import { CommitteeAccessContext } from '@context/committeeAccess';

export const useCommitteeAccess = () => {
  return useContext(CommitteeAccessContext);
};
