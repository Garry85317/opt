import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OAMButton from '../components/base/Button';

test('renders children correctly', () => {
    const buttonText = 'Click me';
    render(<OAMButton>{buttonText}</OAMButton>);
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });
