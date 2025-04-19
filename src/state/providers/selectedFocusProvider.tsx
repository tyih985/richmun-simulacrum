import { ReactNode, useCallback, useState } from 'react';

import { SelectedFocusContext } from '@context/selectedFocus';
import { FocusMapType, MainFocusMap, WhiteLabelFocusMap } from '@lib/informationMap/focusMaps';

export const FocusProvider = ({ children }: { children: ReactNode }) => {
  const [focus, setFocus] = useState<string>('main');
  const [mtd, setMtd] = useState<FocusMapType>(MainFocusMap);

  const updateFocus = useCallback((focus: string) => {
    if (focus === 'main') {
      setFocus(focus);
      setMtd(MainFocusMap);
    }
    if (focus === 'WhiteLabel') {
      setFocus(focus);
      setMtd(WhiteLabelFocusMap);
    }
  }, []);

  return (
    <SelectedFocusContext.Provider
      value={{ selectedFocus: focus, mapMtd: mtd, updateFocus }}
    >
      {children}
    </SelectedFocusContext.Provider>
  );
};
