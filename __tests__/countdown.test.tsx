import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import CountDown from '../components/base/CountDown';

enum Display {
    HOUR,
    SEC,
  }

  test('renders hours countdown correctly', () => {
    render(
      <CountDown timeLeft="2023-12-31T00:00:00" displayType={Display.HOUR} prefix="Remaining:" />,
    );
    expect(screen.getByText(/Remaining: \d{2} \d{2} : \d{2}/)).toBeInTheDocument();
  });
