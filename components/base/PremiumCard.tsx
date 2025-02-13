import React from 'react';
import { useMediaQuery } from '@mantine/hooks';
import {
  Overlay,
  Container,
  Text,
  ScrollArea,
  createStyles,
  Title,
  useMantineTheme,
  em,
  getBreakpointValue,
  rem,
  Flex,
} from '@mantine/core';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  PremiumCheckIcon,
  PremiumBtnIcon,
  PremiumBottomBarIcon,
  PresentBoxIcon,
  PresentCapIcon,
  PremiumBackBarIcon,
  MobileBackbarIcon,
  MobileBottomBarIcon,
  MobileBtnIcon,
} from './icon';
import { useDispatch, useSelector } from '../../store';
import { closeModal } from '../../store/slices';
import {
  selectIsModalVisible,
  selectPremiumEndDate,
  selectPremiumFeatures,
} from '../../store/slices/premium/selectors';

const useStyles = createStyles((theme) => ({
  paper: {
    width: '636px',
    height: '438px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    background: 'white',
    padding: '20px 30px',
    borderRadius: '16px',
    [theme.fn.smallerThan('768')]: {
      width: '300px',
      height: '361px',
    },
  },
  textArea: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    fontWeight: 700,
  },
  sub: {
    fontSize: '14px',
    marginTop: '4px',
  },
  section: {
    marginTop: '30px',
    display: 'flex',
    textAlign: 'center',
    [theme.fn.smallerThan('768')]: {
      marginTop: 20,
    },
  },
  overlay: {
    position: 'fixed',
  },
  info: {
    fontSize: '14px',
    textAlign: 'left',
    marginLeft: rem(16),
    padding: '4px 0',
  },
  title: {
    fontSize: '16px',
    marginBottom: '6px',
  },

  leftBox: {
    background: '#F8F8F8',
    width: '283px',
    padding: '12px 10px',
    marginRight: '5px',
    borderRadius: '4px',
    [theme.fn.smallerThan('768')]: {
      width: 260,
      marginRight: 0,
    },
  },
  btn: {
    position: 'relative',
    bottom: 230,
    background: 'transparent',
    border: 'none',
  },
  rightBox: {
    background: '#F8F8F8',
    width: '283px',
    padding: '12px 10px',
    marginLeft: '5px',
    borderRadius: '4px',
    [theme.fn.smallerThan('768')]: {
      width: 260,
      marginTop: 20,
      marginLeft: 0,
    },
  },
  cap: {
    position: 'relative',
    left: 290,
    bottom: 240,
    [theme.fn.smallerThan('768')]: {
      left: 120,
      bottom: 230,
    },
  },
  present: {
    position: 'relative',
    left: 290,
    bottom: 30,
    [theme.fn.smallerThan('768')]: {
      left: 120,
      bottom: 30,
    },
  },
  bottomBar: {
    position: 'relative',
    bottom: 85,
  },
  mobileBottomBar: {
    position: 'relative',
    bottom: 80,
  },
  backBar: {
    position: 'absolute',
    top: 5,
    left: -16,
    zIndex: -100,
  },
  mobileBackBar: {
    position: 'absolute',
    top: -16,
    left: -10,
    zIndex: -100,
  },

  check: {
    position: 'relative',
    top: 5,
    left: 2,
  },
  div: {
    position: 'relative',
  },

  gotIt: {
    position: 'relative',
    bottom: 225,
  },
  mobileGotIt: {
    position: 'relative',
    bottom: 223,
  },

  scrollArea: {
    marginLeft: 20,
    width: 593,
    height: 226,
    overflow: 'hidden',
    '.mantine-ScrollArea-viewport': {
      '> div': {
        display: 'flex !important',
      },
      [theme.fn.smallerThan('768')]: {
        '> div': {
          flexDirection: 'column',
        },
      },
    },
    [theme.fn.smallerThan('768')]: {
      marginLeft: 0,
      width: 260,
      height: 186,
    },
  },
}));

dayjs.extend(customParseFormat);

export const PremiumCard = ({ title }: { title: string }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const isModalVisible = useSelector(selectIsModalVisible);
  const { oms: omsExpiry, oss: ossExpiry } = useSelector(selectPremiumEndDate);
  const { oms: omsFeatures, oss: ossFeatures } = useSelector(selectPremiumFeatures);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${em(getBreakpointValue(theme.breakpoints.sm) - 1)}`);
  const onBackToDashboard = () => {
    dispatch(closeModal());
  };

  return isModalVisible ? (
    <Container>
      <Overlay
        blur={10}
        center
        color="Grey"
        className={classes.overlay}
        onClick={onBackToDashboard}
      >
        <div className={classes.div}>
          {isMobile ? (
            <MobileBackbarIcon className={classes.mobileBackBar} />
          ) : (
            <PremiumBackBarIcon className={classes.backBar} />
          )}
        </div>
        <div
          className={classes.paper}
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          aria-hidden="true"
        >
          <div className={classes.textArea}>
            <Text>{title}</Text>
          </div>
          <section className={classes.section}>
            <ScrollArea className={classes.scrollArea} scrollbarSize={8} scrollHideDelay={0}>
              <>
                <div className={classes.leftBox}>
                  <Title className={classes.title}>OMS</Title>
                  <Title className={classes.sub}>
                    {omsExpiry
                      ? `Free until ${omsExpiry}.`
                      : 'Unlimited'}
                  </Title>
                  {omsFeatures.map((text: string, index: number) => (
                    <Flex key={`oms-${index}`}>
                      <PremiumCheckIcon className={classes.check} />
                      <Text className={classes.info}>{text}</Text>
                    </Flex>
                  ))}
                </div>
                <div className={classes.rightBox}>
                  <Title className={classes.title}>OSS</Title>
                  <Title className={classes.sub}>
                    {ossExpiry
                      ? `Free until ${ossExpiry}.`
                      : 'Unlimited'}
                  </Title>
                  {ossFeatures.map((text: string, index: number) => (
                    <Flex key={`oss-${index}`}>
                      <PremiumCheckIcon className={classes.check} />
                      <Text className={classes.info}>{text}</Text>
                    </Flex>
                  ))}
                </div>
              </>
            </ScrollArea>
          </section>
          <PresentBoxIcon className={classes.present} />
          {isMobile ? (
            <MobileBottomBarIcon className={classes.mobileBottomBar} />
          ) : (
            <PremiumBottomBarIcon className={classes.bottomBar} />
          )}
          <PresentCapIcon className={classes.cap} />
          {isMobile ? (
            <button onClick={onBackToDashboard} type="button" className={classes.btn}>
              <MobileBtnIcon />
            </button>
          ) : (
            <button onClick={onBackToDashboard} type="button" className={classes.btn}>
              <PremiumBtnIcon />
            </button>
          )}
        </div>
      </Overlay>
    </Container>
  ) : null;
};
