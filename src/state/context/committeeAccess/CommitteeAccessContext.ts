import { createContext } from 'react';

type CommitteeAccessContextType = {
  availableCommittees: string[];
  selectedCommittee: string | null;
  accessLevel: 'staff' | 'delegate' | false;
  allFactions: string[];
  userFactions: string[];
  availableMaps: string[]; // Just an array of map keys for the selected committee
  setSelectedCommittee: (committeeId: string | null) => void;

  // Impersonation additions
  isImpersonating: string[]; // Empty array = not impersonating, otherwise contains impersonated faction IDs
  setImpersonatedFactions: (factionIds: string[]) => void;
  cancelImpersonation: () => void;
};

export const CommitteeAccessContext = createContext<CommitteeAccessContextType>(
  {} as CommitteeAccessContextType,
);
