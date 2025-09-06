import { createContext } from 'react';

type CommitteeContextType = {
  availableCommittees: string[];
  selectedCommittee: string | null;
  role: 'staff' | 'delegate' | false;
  setSelectedCommittee: (committeeId: string | null) => void;
};

export const CommitteeContext = createContext<CommitteeContextType>(
  {} as CommitteeContextType,
);
