import { Button, createStyles, rem, Affix } from '@mantine/core';
import { ContactIcon } from './base/icon';
import { openZendeskChatbot } from '../utils/common';
import { useApi } from '../providers/apiProvider';

const useStyles = createStyles(() => ({
  contact: {
    backgroundColor: 'rgba(70, 94, 227, 0.9)',
    borderRadius: '50px',
    boxShadow: '0px 2px 2px rgba(5, 5, 0, 0.25)',
    width: '48px',
    height: '48px',
    '&:hover': {
      background: 'rgba(70, 94, 227, 1) !important',
    },
  },
}));

export default function ContactUs() {
  const { classes, cx } = useStyles();

  const position = { bottom: rem(20), right: rem(20) };
  const buttonClass = cx(classes.contact);
  const iconStyles = { marginLeft: rem(14) };
  const { zendeskKeyFormData } = useApi();
  return (
    <Affix position={position}>
      <Button
        id="myLauncher"
        className={buttonClass}
        leftIcon={<ContactIcon />}
        styles={() => ({ leftIcon: iconStyles })}
        onClick={() => openZendeskChatbot(zendeskKeyFormData.botType)}
      />
    </Affix>
  );
}
