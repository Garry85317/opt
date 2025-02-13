import React, { MouseEventHandler, FormEventHandler, useRef, useMemo } from 'react';
import { DefaultTFuncReturn } from 'i18next';
import { useDisclosure } from '@mantine/hooks';
import Dialog, { OAMDialogType } from '../components/dialog';

interface Open {
  title?: DefaultTFuncReturn;
  leftButton?: DefaultTFuncReturn;
  rightButton?: DefaultTFuncReturn;
  onLeftClick?: MouseEventHandler<HTMLButtonElement>;
  onRightClick?: MouseEventHandler<HTMLButtonElement>;
  isValid?: boolean;
  formSubmit?: FormEventHandler<HTMLFormElement>;
}

export interface UseModal extends Open {
  // customType?: typeof OAMDialogType[keyof typeof OAMDialogType];
  content?: React.ReactNode;
}

// export const ModalType = OAMDialogType;

export default function useModal({ content, ...props }: UseModal) {
  const [openedPopup, { open, close }] = useDisclosure(false);
  const modalProps = useRef<Open>(props);
  const onOpen = ({
    title,
    leftButton,
    rightButton,
    onLeftClick,
    onRightClick,
    isValid,
    formSubmit,
  }: Open) => {
    open();
    const {
      title: prevTitle,
      leftButton: prevLeftButton,
      rightButton: prevRightButton,
      onLeftClick: prevOnLeftClick,
      onRightClick: prevOnRightClick,
      isValid: prevIsValid,
      formSubmit: prevFormSubmit,
    } = modalProps.current;
    modalProps.current = {
      title: title || prevTitle,
      leftButton: leftButton || prevLeftButton,
      rightButton: rightButton || prevRightButton,
      onLeftClick: onLeftClick || prevOnLeftClick,
      onRightClick: onRightClick || prevOnRightClick,
      isValid: isValid || prevIsValid,
      formSubmit: formSubmit || prevFormSubmit,
    };
  };
  const body = (
    props: Open, //useMemo(
  ) => (
    <Dialog
      customType={OAMDialogType.FORM}
      opened={openedPopup}
      onClose={close}
      title={modalProps.current!.title}
      leftButton={modalProps.current!.leftButton}
      rightButton={modalProps.current!.rightButton}
      onLeftClick={modalProps.current!.onLeftClick}
      onRightClick={modalProps.current!.onRightClick}
      formSubmit={props.formSubmit || modalProps.current!.formSubmit}
      isValid={props.isValid || modalProps.current!.isValid}
    >
      {content}
    </Dialog>
  );
  // ),
  // [openedPopup, content, modalProps.current],
  // );

  return { open: onOpen, change: onOpen, close, body };
}
