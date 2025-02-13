import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { Flex, createStyles, rem } from '@mantine/core';
// import { RenewIcon } from './icon';

function expiredTime(expired: string) {
  return dayjs(expired).diff(dayjs(), 'second');
}

const useStyles = createStyles(() => ({
  root: {
    // width: rem(100),
    alignItems: 'center',
  },
}));

enum Display {
  HOUR,
  SEC,
}

const interval = 1000; // ms
let expected = Date.now() + interval;

export default function CountDown({
  timeLeft,
  onClick,
  displayType = Display.SEC,
  prefix,
}: {
  timeLeft: string;
  onClick?: () => void;
  displayType?: Display;
  prefix?: string;
}) {
  const { classes } = useStyles();
  const timer = useRef(setTimeout(() => {}, 0));
  const [state, setState] = useState<{
    time: { h: number; m: number; s: number };
    seconds: number;
  }>({
    time: { h: 0, m: 0, s: 0 },
    seconds: 300,
  });

  function secondsToTime(secs: number) {
    const hours = Math.floor(secs / (60 * 60));

    const minutesDivisor = secs % (60 * 60);
    const minutes = Math.floor(minutesDivisor / 60);

    const secondsDivisor = minutesDivisor % 60;
    const seconds = Math.ceil(secondsDivisor);

    return {
      h: hours,
      m: minutes,
      s: seconds,
    };
  }

  function step(callback: () => unknown) {
    const dt = Date.now() - expected; // the drift (positive for overshooting)
    if (dt > interval) {
      // something really bad happened. Maybe the browser (tab) was inactive?
      // possibly special handling to avoid futile "catch up" run
    }
    // do what is to be done
    expected += interval;
    // console.log('step', timer.current, interval - dt);
    clearTimeout(timer.current);
    timer.current = setTimeout(callback, Math.max(0, interval - dt)); // take into account drift
  }

  function countDown() {
    // Remove one second, set state so a re-render happens.
    const seconds = expiredTime(timeLeft);
    setState({
      time: secondsToTime(seconds),
      seconds,
    });
  }

  function renderDigits(digit: number) {
    if (digit < 10) return `0${digit}`;
    return digit;
  }

  useEffect(() => {
    const seconds = expiredTime(timeLeft);
    setState({ ...state, seconds });
  }, [timeLeft]);

  useEffect(() => {
    // Check if we're at zero.
    if (state.seconds > 0) step(countDown);
  }, [timer.current, state.seconds]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <Flex className={classes.root}>
      {/* &nbsp;
      <RenewIcon onClick={onClick} /> */}
      {displayType === Display.HOUR
        ? `${prefix} ${renderDigits(state.time.h)} ${renderDigits(state.time.m)} : ${renderDigits(
            state.time.s,
          )}`
        : `${prefix} ${state.seconds >= 0 ? state.seconds : '-'} Sec`}
    </Flex>
  );
}
