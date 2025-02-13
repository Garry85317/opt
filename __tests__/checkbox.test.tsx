import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OAMCheckbox from '../components/base/Checkbox';

test('checkbox onChange work', () => {
  const onChangeMock = jest.fn();
  render(<OAMCheckbox onChange={onChangeMock} />);
  fireEvent.click(screen.getByRole('checkbox'));
  expect(onChangeMock).toBeCalled();
});

test('indeterminate should work', () => {
    render(<OAMCheckbox indeterminate />);
    const indeterminateIcon = screen.getByTestId('indeterminate-icon');
    expect(indeterminateIcon).toBeInTheDocument();
});
