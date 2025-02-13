import React from 'react';
import { toBeRequired } from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import OAMTextInput from '../components/base/TextInput';
import { render, screen } from '../utils/test-utils';

test('visibleProps should show when has type password', () => {
  render(<OAMTextInput required label="OAMInput" type="password" visible />);
  const element = screen.getByText('OAMInput');
  const require = screen.getByText('*');
    const buttonVisible = screen.getByRole('button');
    expect(buttonVisible).toBeVisible();
  expect(element).toHaveTextContent('OAMInput');
  expect(require).toHaveTextContent('*');
  expect(element).toBeVisible();
});

test('able to be disabled and render textInput if no type', () => {
  const handlerOnchange = () => 'test';
  const disable = true;
  render(
    <OAMTextInput
      disabled={disable}
      required
      label="textInput"
      value="test"
      onChange={handlerOnchange}
    />,
  );
  const require = screen.getByText('*');
  const value = screen.getByDisplayValue('test');
  const label = screen.getByText('textInput');
  expect(require).toHaveTextContent('*');
  expect(label).toHaveTextContent('textInput');
  expect(value).toHaveValue('test');
  expect(value).toBeDisabled();
});
