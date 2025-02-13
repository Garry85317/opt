import { Button, createStyles, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const useStyles = createStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '20px',
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fontSizes.xl,
    marginBottom: theme.spacing.xl,
  },
  text: {
    fontSize: theme.fontSizes.xs,
    marginBottom: theme.spacing.xl,
  },
  button: {
    color: '#415284',
    borderColor: '#415284',
  },
}));

function RegisterRequestSuccessPage() {
  const { t } = useTranslation();
  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Text className={classes.title}>{t('Check_registration_email_title')}</Text>
        <Text className={classes.text}>
          {`${t('Check_registration_email_content')}\n\n${t('Check_spam_folder')}`}
        </Text>
        <Button className={classes.button}>{t('Ok')}</Button>
      </div>
    </div>
  );
}

export default RegisterRequestSuccessPage;
