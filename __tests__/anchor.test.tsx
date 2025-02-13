// Import necessary testing libraries and dependencies
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Import the component to be tested
import OAMAnchor from '../components/base/Anchor';

test('if anchor direct to the assigned component', () => {
    const refMock = React.createRef<HTMLAnchorElement>();
    const component = 'div';
    const onClick = jest.fn();
    const children = 'test children';
    render(<OAMAnchor ref={refMock} component={component} onClick={onClick}>{children}</OAMAnchor>);
    fireEvent.click(screen.getByText('test children'));
    expect(onClick).toHaveBeenCalled();
    expect(refMock.current).toBeTruthy();
    expect(refMock.current).toBeInTheDocument();
});
