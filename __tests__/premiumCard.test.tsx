import React from 'react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import { matchMedia } from '../utils/matchMedia';
import { PremiumCard } from '../components/base/PremiumCard';
import { prettyDOM, render, screen } from '../utils/test-utils';

matchMedia();
const resizeWindow = (x: number, y: number) => {
  console.log('Resizing window to:', x, 'x', y);
  window.innerWidth = x;
  window.innerHeight = y;
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
};

test('do have button', async () => {
  const close = jest.fn();
  resizeWindow(766, 724);
  render(<PremiumCard closeModal={close} />);
  const element = screen.getByRole('button');
  expect(element).toHaveClass('mantine-vtzolx');
});
