import { createContext, useContext } from 'react';

/** Ids focused by the current beat. Empty = nothing dimmed. */
export const FocusContext = createContext<ReadonlySet<string>>(new Set());

/** className for an element that can be focused through any of its ids (cell, row, column, table). */
export function useFocus(...ids: (string | undefined)[]): string {
  const set = useContext(FocusContext);
  if (!set.size) return 'focusable';
  return ids.some((i) => i && set.has(i)) ? 'focusable is-focus' : 'focusable is-dim';
}
