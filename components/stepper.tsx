import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Stepper,
  Text,
  List,
  Group,
  createStyles,
  useMantineTheme,
  rem,
  em,
  getBreakpointValue,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Button, { OAMButtonType } from './base/Button';
import Checkbox from './base/Checkbox';
import { DeleteIcon } from './base/icon';

interface OAMStepper {
  className?: string;
  steps: { title: string; description: string[]; inputs: React.ReactNode }[];
  currentStep: number;
  canNext: boolean;
  setCurrentStep: (step: number) => void;
  prevStep: () => void;
  nextStep: () => void;
  isAllChecked: boolean;
  indeterminate?: boolean;
  onAllChecked: () => void;
}
const color = 'var(--b-2-b-secondary-465-ee-3, #465EE3)';
const useStyles = createStyles((theme) => ({
  root: {
    '.mantine-Stepper-steps': {
      width: '70%',
      margin: `0 auto ${rem(20 + 27)}`,
    },
    '.mantine-Stepper-content': {
      background: 'var(--gray-f-8-f-8-f-8, #F8F8F8)',
      padding: rem(20),
      borderRadius: rem(6),
    },
  },
  step: {
    color: 'var(--gray-7-b-7-b-7-b, #7B7B7B)',
    ':is([data-completed])': {
      '.mantine-Stepper-stepLabel': {
        color,
      },
    },
    ':is([data-progress])': {
      color,
    },
    '.mantine-Stepper-stepIcon': {
      border: '1px solid var(--gray-7-b-7-b-7-b, #7B7B7B)',
      color: 'var(--gray-7-b-7-b-7-b, #7B7B7B)',
      background: 'var(--gray-ffffff, #FFF)',
      ':is([data-completed])': {
        backgroundColor: color,
        borderColor: color,
      },
      ':is([data-progress])': {
        backgroundColor: color,
        borderColor: color,
        color: 'var(--gray-ffffff, #FFF)',
      },
    },
  },
  labelWrapper: {
    position: 'relative',
    '.mantine-Stepper-stepBody': {
      marginLeft: 0,
      position: 'absolute',
      top: rem(42),
      width: 'max-content',
      left: '50%',
    },
  },
  label: {
    position: 'relative',
    top: rem(10),
    left: '-50%',
    fontSize: rem(14),
  },
  mobile: {
    '.mantine-Stepper-content': {
      paddingTop: 0,
    },
    '.mantine-Stepper-separator': {
      display: 'none',
    },
    '.mantine-Stepper-step': {
      display: 'none',
      ':is([data-progress])': {
        display: 'flex',
      },
    },
  },
  stepTitle: {
    width: '85%',
    margin: `0 auto ${rem(20)}`,
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  description: {
    marginTop: rem(10),
    marginBottom: rem(20),
    fontSize: rem(14),
    fontWeight: 400,
  },
  stepButton: {
    minWidth: rem(80),
  },
  actions: {
    marginBottom: rem(14),
  },
  selectAll: {
    padding: 0,
  },
  iconButton: {
    width: rem(36),
    padding: 0,
  },
}));

function OAMStepper({
  className,
  steps,
  currentStep,
  canNext,
  setCurrentStep,
  prevStep,
  nextStep,
  isAllChecked,
  indeterminate = false,
  onAllChecked,
}: OAMStepper) {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)}`);
  const { classes, cx } = useStyles();

  const stepTitle = useCallback(
    () =>
      isMobile || (
        <Group className={classes.stepTitle}>
          {steps.map(({ title }, index) => (
            <Text key={`key-${index}`}>{title}</Text>
          ))}
        </Group>
      ),
    [isMobile, steps],
  );

  return (
    <>
      {false || (
        <Stepper
          className={cx(isMobile ? classes.mobile : classes.root, className)}
          active={currentStep - 1}
          onStepClick={(step) => {
            if (canNext || step < currentStep) setCurrentStep(step + 1);
          }}
          breakpoint="sm"
          completedIcon={<div>{1}</div>}
        >
          {steps.map(({ title, description, inputs }, index) => {
            const children = (
              <>
                {isMobile || <Text>{title}</Text>}
                <List className={classes.description} type="ordered">
                  {description.map((item, key) => (
                    <List.Item key={`key-${key}`}>{item}</List.Item>
                  ))}
                </List>
                {isMobile && (
                  <Group position="apart" className={classes.actions}>
                    <Button variant="default" className={classes.selectAll}>
                      <Checkbox
                        label={t('Select_all')}
                        checked={isAllChecked}
                        onChange={onAllChecked}
                        indeterminate={indeterminate}
                        styles={() => ({
                          inner: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: rem(8),
                          },
                          input: {
                            width: rem(14),
                            height: rem(14),
                            borderColor: '#666666',
                          },
                          label: {
                            paddingLeft: rem(8),
                            paddingRight: rem(16),
                            color: ' var(--gray-444444, #444)',
                            fontSize: rem(14),
                            fontWeight: 400,
                          },
                        })}
                      />
                    </Button>
                    <Button
                      // customType={index === 0 ? OAMButtonType.DARK : OAMButtonType.LIGHT_OUTLINE}
                      className={classes.iconButton}
                      onClick={() => {
                        /** delete */
                      }}
                      // disabled={disabled}
                    >
                      <DeleteIcon />
                    </Button>
                  </Group>
                )}
                {inputs}
              </>
            );

            return (
              <Stepper.Step
                key={title}
                className={cx(classes.step, isMobile ? '' : classes.labelWrapper)}
                label={<Text className={isMobile ? '' : classes.label}>{title}</Text>}
                icon={<div>{index + 1}</div>}
                completedIcon={<div>{index + 1}</div>}
              >
                {children}
                {/* <>{stepAddSN()}</> */}
              </Stepper.Step>
            );
          })}
        </Stepper>
      )}
      <Group position="right" mt="xl">
        <Button
          className={classes.stepButton}
          variant="default"
          customType={OAMButtonType.LIGHT_OUTLINE}
          onClick={prevStep}
        >
          {t('Cancel')}
        </Button>
        <Button
          className={classes.stepButton}
          customType={OAMButtonType.DARK}
          onClick={nextStep}
          // TODO disabled while form not complete
          disabled={!canNext}
        >
          {currentStep === steps.length ? t('Done') : t('Next')}
        </Button>
      </Group>
    </>
  );
}

export default OAMStepper;
