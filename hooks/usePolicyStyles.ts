import { em, rem, getBreakpointValue, createStyles } from '@mantine/core';

const grey = 'var(--gray-444444, #444444)';
const lightGrey = 'var(--gray-7b7b7b, #7b7b7b)';
const secondary = 'var(--b-2-b-secondary-465-ee-3, #465EE3)';
const primary = 'var(--b-2-b-primary-primary-415284, #415284)';
export const usePolicyStyles = createStyles((theme) => ({
  shell: {
    main: {
      padding: rem(40),
      [`@media (max-width: ${em(getBreakpointValue(theme.breakpoints.sm))})`]: {
        padding: rem(30),
      },
      [`@media (min-width: ${em(360)})`]: {
        padding: rem(30),
      },
    },
    'p, li': {
      fontSize: rem(16),
      fontWeight: 400,
      marginBottom: rem(16),
    },
  },
  logo: {
    width: rem(150),
    height: rem(48),
    marginBottom: rem(30),
  },
  title: {
    color: grey,
    fontSize: rem(24),
    fontWeight: 700,
    marginBottom: rem(16),
  },
  date: {
    color: lightGrey,
    fontSize: rem(14),
    fontWeight: 700,
  },
  table: {
    overflow: 'scroll',
    marginBottom: rem(16),
    table: {
      'thead tr th, tbody tr td': {
        fontSize: rem(16),
      },
    },
  },
  subTitle: {
    fontSize: rem(18),
    fontWeight: 700,
    marginBottom: rem(16),
  },
  link: {
    color: secondary,
    fontSize: rem(14),
    fontWeight: 400,
  },
  text: {
    fontSize: rem(16),
    fontWeight: 400,
  },
  tick: {
    color: 'black',
  },
  cross: {
    color: 'black',
  },
  copyright: {
    fontSize: rem(16),
    fontWeight: 400,
    color: primary,
  },
}));
