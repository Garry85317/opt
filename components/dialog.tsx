import React, { MouseEventHandler, FormEventHandler, useCallback } from 'react';
import { Modal, Text, Group, rem, createStyles, ModalProps, Container } from '@mantine/core';
import { DefaultTFuncReturn } from 'i18next';
import Button, { OAMButtonType } from './base/Button';

export enum OAMDialogType {
  IMPORT,
  MESSAGE,
  FORM,
  NONE,
}

interface Dialog {
  customType?: typeof OAMDialogType[keyof typeof OAMDialogType];
  opened: boolean;
  onClose: () => void;
  title?: DefaultTFuncReturn;
  message?: DefaultTFuncReturn | JSX.Element;
  leftButton?: DefaultTFuncReturn;
  rightButton?: DefaultTFuncReturn;
  extraRightButton?: DefaultTFuncReturn;
  onLeftClick?: MouseEventHandler<HTMLButtonElement>;
  onRightClick?: MouseEventHandler<HTMLButtonElement>;
  extraRightClick?: MouseEventHandler<HTMLButtonElement>;
  isValid?: boolean;
  formSubmit?: FormEventHandler<HTMLFormElement>;
  children?: React.ReactNode;
  trapFocus?: boolean;
  closeOnEscape?: boolean;
}

const useStyles = createStyles(() => ({
  title: {
    marginBottom: rem(16),
    color: 'var(--gray-000000, #000)',
    /* Web/Body L 16/Medium */
    fontSize: rem(16),
    fontWeight: 500,
  },
  form: {
    marginBottom: rem(16),
  },
  message: {
    marginBottom: rem(20),
    color: 'var(--gray-666666, #666)',
    /* Web/Body 14/Regular */
    fontSize: rem(14),
    fontWeight: 400,
    whiteSpace: 'pre-wrap',
  },
}));

const Dialog = ({
  customType = OAMDialogType.NONE,
  opened,
  onClose,
  title,
  message,
  leftButton,
  rightButton,
  extraRightButton,
  extraRightClick,
  onLeftClick,
  onRightClick,
  isValid,
  formSubmit,
  children,
  trapFocus,
  closeOnEscape,
  ...props
}: Dialog & ModalProps) => {
  const { classes } = useStyles();
  const rightButtonType = leftButton ? OAMButtonType.DARK : OAMButtonType.LIGHT_OUTLINE;
  const buttonStyles = useCallback(
    () => ({
      root: {
        maxWidth: rem(150),
        paddingLeft: rem(20),
        paddingRight: rem(20),
      },
    }),
    [],
  );
  const messageContent =
    typeof message === 'string' ? <Text className={classes.message}>{message}</Text> : message;

  return (
    <Modal
      {...props}
      opened={opened}
      onClose={onClose}
      centered
      closeOnClickOutside={false}
      withCloseButton={false}
      trapFocus={trapFocus || false}
      closeOnEscape={closeOnEscape || false}
      styles={(theme) => ({
        root: {
          '.mantine-Modal-content': {
            overflow: 'visible',
          },
        },
        inner: {
          [theme.fn.smallerThan('sm')]: {
            paddingTop: rem(110),
            paddingBottom: rem(50),
            paddingLeft: rem(10),
            paddingRight: rem(10),
          },
          [theme.fn.largerThan('sm')]: {
            paddingTop: rem(110),
            paddingBottom: rem(50),
          },
        },
        content: {
          maxWidth: rem(340),
          '.mantine-ScrollArea-root': {
            overflow: 'auto',
            maxHeight: '75dvh',
          },
        },
        body: {
          padding: rem(20),
        },
      })}
    >
      <Text className={classes.title}>{title}</Text>
      {customType === OAMDialogType.FORM && (
        <form onSubmit={formSubmit}>
          {messageContent}
          <div className={classes.form}>{children}</div>
          <Group position="center">
            {leftButton && (
              <Button
                customType={OAMButtonType.LIGHT_OUTLINE}
                onClick={onLeftClick}
                // styles={buttonStyles}
              >
                {leftButton}
              </Button>
            )}
            {rightButton && (
              <Button
                disabled={isValid === undefined ? false : !isValid}
                type="submit"
                customType={rightButtonType}
                onClick={onRightClick as MouseEventHandler<HTMLButtonElement>}
              >
                {rightButton}
              </Button>
            )}
            {extraRightButton && (
              <Button customType={rightButtonType} onClick={extraRightClick}>
                {extraRightButton}
              </Button>
            )}
          </Group>
        </form>
      )}
      {customType === OAMDialogType.FORM || (
        <>
          <Container p={0} mb="sm">
            {messageContent}
          </Container>
          <Group position="center">
            {leftButton && (
              <Button
                customType={OAMButtonType.LIGHT_OUTLINE}
                onClick={onLeftClick}
                styles={buttonStyles}
              >
                {leftButton}
              </Button>
            )}
            {customType === OAMDialogType.NONE || (
              <Button
                disabled={isValid === undefined ? false : !isValid}
                customType={rightButtonType}
                onClick={onRightClick as MouseEventHandler<HTMLButtonElement>}
                styles={buttonStyles}
              >
                {rightButton}
              </Button>
            )}
            {extraRightButton && (
              <Button customType={rightButtonType} onClick={extraRightClick}>
                {extraRightButton}
              </Button>
            )}
          </Group>
        </>
      )}
    </Modal>
  );
};

export default Dialog;
