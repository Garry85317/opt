import React from 'react';
import OAMSelect from '../components/base/Select';
import { render, screen } from '../utils/test-utils';

//TODO:failed to mock style
interface classNames {
  names:'hihi'
}

jest.mock('@mantine/core', () => {
  const originalMantineCore = jest.requireActual('@mantine/core');
  // Mock createStyles to return a basic object
  const MockCreateStyles = jest.fn((styles) => ({
    border: 'mock-border-value',
    ...styles,
  }));
  // Include other necessary mocks from @mantine/core
  const MockSelect = jest.fn(() => <div data-testid="mocked-select" />);
  const MockUseStyles = jest.fn(() => () => {
    const classes = {
      border: 'mock-border-value',
      line: 'mock',
      subtle: 'mockk',
    };
    const cx = (classNames:classNames) =>
      // Implement cx logic if needed
       classNames;
return { classes, cx };
  });
  return {
    ...originalMantineCore,
    createStyles: MockCreateStyles,
    Select: MockSelect,
    useStyles: MockUseStyles,
  };
});

test('should have data', () => {
  const data = ['testA'];
 render(<OAMSelect data={data} />);
 //eslint-disable-next-line
 screen.debug();
  const mockedSelect = screen.getByTestId('mocked-select');
  expect(mockedSelect).toHaveTextContent('testA');
});
