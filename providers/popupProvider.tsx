import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import {
  Open,
  useChangePasswordPopup,
  useChangeLocationPopup,
  useResetPasswordPopup,
  useInvitationPasswordPopup,
  useMessagePopup,
  useOwnerUserDeletePopup,
  usePowerUserDeletePopup,
  useUserDeletePopup,
  useMessageWithClosePopup,
  useLoadingPopup,
  useUserDataTransferPopup,
} from '../components/popup';

type PopUpState = {
  open: (x: Open) => void;
  close: () => void;
};

const initialState = {
  invitationPassword: {
    open: ({ email, result }: Open) => {},
    close: () => {},
  } as PopUpState,
  message: {
    open: (open) => {},
    close: () => {},
  } as PopUpState,
  changePassword: {
    open: ({ result, cancel }) => {},
    close: () => {},
  } as PopUpState,
  changeLocation: {
    open: ({ result, cancel }) => {},
    close: () => {},
  } as PopUpState,
  resetPassword: {
    open: ({ result, cancel }) => {},
    close: () => {},
  } as PopUpState,
  useOwnerDelete: {
    open: ({ result, cancel }) => {},
    close: () => {},
  } as PopUpState,
  userDelete: {
    open: ({ result, cancel }) => {},
    close: () => {},
  } as PopUpState,
  powerUserDelete: {
    open: ({ result, cancel }) => {},
    close: () => {},
  } as PopUpState,
  messageWithClose: {
    open: ({ tit, msg }) => {},
    close: () => {},
  } as PopUpState,
  loadingPopup: {
    open: () => {},
    close: () => {},
  },
  userDataTransferPopup: {
    open: (arg: Open) => {},
    close: () => {},
  },
};

const PopupContext = createContext(initialState);

const PopupProvider = ({ children }: { children: ReactNode }) => {
  const invitationPasswordPopup = useInvitationPasswordPopup();
  const messagePopup = useMessagePopup();
  const changePasswordPopup = useChangePasswordPopup();
  const changeLocationPopup = useChangeLocationPopup();
  const resetPasswordPopup = useResetPasswordPopup();
  const powerUserDeletePopup = usePowerUserDeletePopup();
  const useOwnerDeletePopup = useOwnerUserDeletePopup();
  const userDeletePopup = useUserDeletePopup();
  const messageWithClosePopup = useMessageWithClosePopup();
  const loadingPopup = useLoadingPopup();
  const userDataTransferPopup = useUserDataTransferPopup();

  const value = useMemo(
    () => ({
      invitationPassword: {
        open: invitationPasswordPopup.open,
        close: invitationPasswordPopup.close,
      },
      message: {
        open: messagePopup.open,
        close: messagePopup.close,
      },
      changePassword: {
        open: changePasswordPopup.open,
        close: changePasswordPopup.close,
      },
      changeLocation: {
        open: changeLocationPopup.open,
        close: changeLocationPopup.close,
      },
      resetPassword: {
        open: resetPasswordPopup.open,
        close: resetPasswordPopup.close,
      },
      userDelete: {
        open: userDeletePopup.open,
        close: userDeletePopup.close,
      },
      useOwnerDelete: {
        open: useOwnerDeletePopup.open,
        close: useOwnerDeletePopup.close,
      },
      powerUserDelete: {
        open: powerUserDeletePopup.open,
        close: powerUserDeletePopup.close,
      },
      messageWithClose: {
        open: messageWithClosePopup.open,
        close: messageWithClosePopup.close,
      },
      loadingPopup: {
        open: loadingPopup.open,
        close: loadingPopup.close,
      },
      userDataTransferPopup: {
        open: userDataTransferPopup.open,
        close: userDataTransferPopup.close,
      },
    }),
    [],
  );

  return (
    <PopupContext.Provider value={value}>
      {invitationPasswordPopup.body}
      {changePasswordPopup.body}
      {changeLocationPopup.body}
      {resetPasswordPopup.body}
      {useOwnerDeletePopup.body}
      {userDeletePopup.body}
      {powerUserDeletePopup.body}
      {messageWithClosePopup.body}
      {messagePopup.body}
      {loadingPopup.body}
      {userDataTransferPopup.body}
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);

export default PopupProvider;
