import { createContext } from "react";

type CommitteeAccessContextType = {
    availableMaps: string[] // Just an array of map keys for the selected committee
    selectedCommittee: string | null
    accessLevel: 'staff' | 'delegate' | false
    visibiltyFactions: string[]
}

export const CommitteeAccessContext = createContext<CommitteeAccessContextType>(
  {} as CommitteeAccessContextType,
);
