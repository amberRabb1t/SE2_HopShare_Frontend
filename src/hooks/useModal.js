import { useState, useCallback } from 'react';

/*
  Custom hook to manage modal visibility state.
  Returns an object with:
  - open: boolean indicating if the modal is open
  - show: function to open the modal
  - hide: function to close the modal
*/

export function useModal() {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);
  return { open, show, hide };
}

