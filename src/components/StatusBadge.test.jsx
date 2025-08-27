import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge Component', () => {

  test('renders correctly for "Completed" status', () => {
    render(<StatusBadge status="Completed" />);
    
    // --- THIS IS THE FIX ---
    // Find the parent element by its test ID
    const badgeElement = screen.getByTestId('status-badge');
    
    // Assert that it contains the correct text
    expect(badgeElement).toHaveTextContent('Completed');
    
    // Assert that it has the correct classes
    expect(badgeElement).toHaveClass('bg-green-100', 'text-green-800');
  });

  test('renders correctly for "Scheduled" status', () => {
    render(<StatusBadge status="Scheduled" />);
    
    // --- THIS IS THE FIX ---
    const badgeElement = screen.getByTestId('status-badge');
    
    expect(badgeElement).toHaveTextContent('Scheduled');
    expect(badgeElement).toHaveClass('bg-blue-100', 'text-blue-800');
  });
});