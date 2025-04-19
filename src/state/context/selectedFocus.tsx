/**
 * handles the selected course Focus
 * handles the selected focus question
 */
import { createContext } from 'react';

import {
  FocusMapType,
  MainFocusMap,
} from '@lib/informationMap/focusMaps';

type SelectedFocusContextType = {
  selectedFocus: string;
  mapMtd: FocusMapType;
  updateFocus: (question: string) => void;
};

export const SelectedFocusContext = createContext<SelectedFocusContextType>({
  selectedFocus: 'main',
  mapMtd: MainFocusMap,
  updateFocus: () => undefined,
});


