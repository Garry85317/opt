import { MouseEventHandler } from 'react';
import { createStyles, rem } from '@mantine/core';
import { DialogCloseIcon } from './icon';

const useStyles = createStyles((theme) => ({
  icon: {
    height: rem(32),
    borderRadius: '50%',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    ':active': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    cursor: 'pointer',
  },
}));

function DialogCloseButton({ clickEvent }: { clickEvent: MouseEventHandler | undefined }) {
  const { classes } = useStyles();

  return (
    <div className={classes.icon}>
      <DialogCloseIcon onClick={clickEvent} />
    </div>
  );
}

export default DialogCloseButton;
