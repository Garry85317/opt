import { useCallback, useEffect } from 'react';

import { usePopup } from '../providers/popupProvider';

const blurActiveElement = () =>
  document.activeElement && (document.activeElement as HTMLElement).blur();

export default function useCriticalLoadingAction() {
  const { loadingPopup } = usePopup();

  const enterLoading = useCallback(() => {
    blurActiveElement();
    loadingPopup.open();
  }, []);
  const leaveLoading = useCallback(() => {
    loadingPopup.close();
  }, []);

  useEffect(() => leaveLoading, []); // show loading until page exit

  return {
    enterLoading,
    leaveLoading,
  };
}
