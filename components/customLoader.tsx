import { Flex, Text, rem } from '@mantine/core';
import React from 'react';

import styles from './style/customLoader.module.css';

export const LOADING_TEXT_WIDTH = 115;

export function CustomLoader({ loadingText }: { loadingText: string }) {
  return (
    <Flex direction="column" align="center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="55"
        height="55"
        viewBox="0 0 55 55"
        fill="none"
      >
        <path
          opacity="0.4"
          d="M27.5 49C39.6503 49 49.5 39.1503 49.5 27C49.5 14.8497 39.6503 5 27.5 5C15.3497 5 5.5 14.8497 5.5 27C5.5 39.1503 15.3497 49 27.5 49Z"
          stroke="#415284"
          strokeWidth="7"
          strokeMiterlimit="10"
          strokeLinecap="round"
          className={styles.spinner}
        />
        <path
          opacity="0.6"
          d="M27.2794 5.00006C31.337 4.99067 35.3194 6.08663 38.7927 8.16852C42.266 10.2504 45.0969 13.2384 46.9769 16.8068C48.8569 20.3753 49.714 24.3873 49.4547 28.4058C49.1954 32.4243 47.8297 36.2952 45.5064 39.5965C43.1831 42.8979 39.9913 45.5031 36.2789 47.1284C32.5664 48.7537 28.4756 49.3366 24.4523 48.8137C20.429 48.2908 16.6275 46.6822 13.4619 44.163C10.2964 41.6438 7.88829 38.3108 6.5 34.5271"
          stroke="#415284"
          strokeWidth="7"
          strokeMiterlimit="10"
          strokeLinecap="round"
          className={styles.spinner}
        />
        <path
          d="M26.5 5C39.2027 5 49.5 14.9238 49.5 27.1653C49.5 36.7436 43.1961 44.9022 34.3689 48"
          stroke="#415284"
          strokeWidth="7"
          strokeMiterlimit="10"
          strokeLinecap="round"
          className={styles.spinner}
        />
      </svg>
      <Text color="#415284" size={rem(14)} pt={rem(16)} w={rem(LOADING_TEXT_WIDTH)} ta="center">
        {loadingText}
      </Text>
    </Flex>
  );
}
