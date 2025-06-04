import { createContext } from "react";

type CommitteeAccessContextType = {
    availableMaps: Record<string, string[]> // Committee ID : [map1, map2]
    accessLevel: 'view' | 'edit'
    visibiltyFactions: string[]
}

export const CommitteeAccessContext = createContext<CommitteeAccessContextType>(
  {} as CommitteeAccessContextType,
);
