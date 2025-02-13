import { AppShell } from '@mantine/core';

import LanguageMenu from './headerBar/language';
import HeaderBar, { IconTheme } from './headerBar';
import Dialog, { OAMDialogType } from './dialog';

function FullPagePrompt({
  children,
  withLanguage,
}: {
  children: React.ReactNode;
  withLanguage?: boolean;
}) {
  return (
    <AppShell
      header={
        <HeaderBar backgroundColor="#FFFFFF" titleColor="#01256B">
          {withLanguage && <LanguageMenu theme={IconTheme.LIGHT} />}
        </HeaderBar>
      }
      styles={{
        root: { '.mantine-Header-root': { boxShadow: '0px 1px 2px 0px #00000029' } },
        main: { backgroundColor: '#F2F2F2' },
      }}
    >
      {children}
    </AppShell>
  );
}

type SimpleMessagePagePromptProps = {
  title: string;
  someText: string;
  buttonText: string;
  onClick: () => void;
};

function SimpleMessagePagePrompt({
  title,
  someText,
  buttonText,
  onClick,
}: SimpleMessagePagePromptProps) {
  return (
    <Dialog
      customType={OAMDialogType.MESSAGE}
      opened
      onClose={() => {}}
      title={title}
      message={someText}
      rightButton={buttonText}
      onRightClick={onClick}
      lockScroll={false}
    />
  );
}

export { FullPagePrompt, SimpleMessagePagePrompt };
