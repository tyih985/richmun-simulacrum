import { createContext } from "react";

type CommitteeAccessContextType = {
    availableMaps: string[] // Just an array of map keys for the selected committee
    availableCommittees: string[]
    selectedCommittee: string | null
    accessLevel: 'staff' | 'delegate' | false
    visibiltyFactions: string[]
    setSelectedCommittee: (committeeId: string | null) => void
}

export const CommitteeAccessContext = createContext<CommitteeAccessContextType>(
  {} as CommitteeAccessContextType,
);
