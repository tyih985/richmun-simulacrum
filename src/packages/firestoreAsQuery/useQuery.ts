/**
 * this reducer mimics the structure of @tanstack/react-query
 * for the sake of hook consistency
 */

import { useReducer } from 'react';

export type QueryState<T> = {
  data: T | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
};

export const useFirestoreQuery = <T>() => {
  const initialState: QueryState<T> = {
    data: undefined,
    isLoading: true,
    isSuccess: false,
    isError: false,
    error: null,
  };
  return useReducer(queryReducer<T>, initialState);
};

type QueryAction<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_ERROR'; payload: string };

const queryReducer = <T>(state: QueryState<T>, action: QueryAction<T>): QueryState<T> => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, isError: false, isSuccess: false, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: action.payload,
      };
    default:
      return state;
  }
};
