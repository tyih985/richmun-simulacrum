import { useContext } from 'react';
import { SelectedFocusContext } from '@context/selectedFocus';

export const useSelectedFocus = () => {
  const context = useContext(SelectedFocusContext);
  if (!context) throw new Error('useFocus must be used within a FocusProvider');
  return context;
};
