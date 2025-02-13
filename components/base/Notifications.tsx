import { CSSObject, rem } from '@mantine/core';
import {
  Notifications,
  notifications,
  NotificationProps,
  NotificationsProps,
} from '@mantine/notifications';
import { DefaultTFuncReturn } from 'i18next';

interface OAMNotificationProps extends Omit<NotificationProps, 'title' | 'message'> {
  id?: string;
  title?: DefaultTFuncReturn;
  message?: DefaultTFuncReturn;
}
interface OAMNotificationUpdateProps extends OAMNotificationProps {
  id: string;
}

const whiteColor = 'var(--gray-ffffff, #FFF)';
const backgroundColor = 'var(--b-2-b-primary-primary-415284, #415284)';

const root: CSSObject = {
  padding: `${rem(10)} ${rem(20)}`,
  backgroundColor,
  borderColor: backgroundColor,
  borderRadius: rem(6),
  '&::before': { backgroundColor },
};
const title: CSSObject = {
  textAlign: 'center',
  color: whiteColor,
  fontSize: rem(14),
  fontWeight: 400,
};
const description: CSSObject = {
  textAlign: 'center',
  color: whiteColor,
  fontSize: rem(14),
  fontWeight: 400,
};
const closeButton: CSSObject = {
  color: whiteColor,
  '&:hover': {
    color: backgroundColor,
    backgroundColor: whiteColor,
  },
};

const oamNotificationProps = (props: OAMNotificationProps) => ({
  ...props,
  message: props.message ?? '',
  autoClose: props.autoClose ?? 2000,
  withCloseButton: props.withCloseButton ?? false,
  closeButtonProps: props.closeButtonProps ?? {},
});

export function OAMNotifications(props: NotificationsProps) {
  return (
    <Notifications
      position="bottom-center"
      {...props}
      style={{
        width: 'auto',
      }}
    />
  );
}

export const oamNotifications = {
  ...notifications,
  show: (props: OAMNotificationProps) =>
    notifications.show({
      ...oamNotificationProps(props),
      styles: () => ({
        root,
        title,
        description,
        closeButton,
      }),
    }),
  update: (props: OAMNotificationUpdateProps) =>
    notifications.update({
      ...oamNotificationProps(props),
      id: props.id,
      styles: () => ({
        root,
        title,
        description,
        closeButton,
      }),
    }),
};

export async function oamNotificationsShowUntil(
  showProps: OAMNotificationUpdateProps,
  fn: { waitFn: Function; params?: unknown[] },
  updateProps: OAMNotificationProps,
) {
  oamNotifications.show({
    autoClose: false,
    ...showProps,
  });
  const result = await fn.waitFn(...(fn?.params ? (fn.params as unknown[]) : []));
  oamNotifications.update({
    message: '',
    autoClose: 2000,
    ...updateProps,
    id: showProps.id,
  });
  return result;
}
