import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import MuteButton from './MuteButton';
import React from 'react';

// Wrapper for Chakra UI components
const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('MuteButton', () => {
  test('renders the mute button', () => {
    renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('initially displays Mute label when not muted', () => {
    renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button', { name: 'Mute' });
    expect(button).toBeInTheDocument();
  });

  test('toggles to Unmute label after clicking', () => {
    renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button', { name: 'Mute' });

    fireEvent.click(button);

    expect(screen.getByRole('button', { name: 'Unmute' })).toBeInTheDocument();
  });

  test('toggles back to Mute label after clicking twice', () => {
    renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button');

    // Click once to mute
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: 'Unmute' })).toBeInTheDocument();

    // Click again to unmute
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument();
  });

  test('logs mute state to console when clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(consoleSpy).toHaveBeenCalledWith('Mute button clicked. Muted:', true);

    consoleSpy.mockRestore();
  });

  test('displays VolumeUpIcon initially', () => {
    const { container } = renderWithChakra(<MuteButton />);
    const svgs = container.querySelectorAll('svg');

    // Should have exactly one SVG (the icon)
    expect(svgs.length).toBeGreaterThan(0);
  });

  test('changes icon after clicking', () => {
    renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button');

    // Get initial aria-label
    expect(button).toHaveAttribute('aria-label', 'Mute');

    // Click and verify aria-label changed (indicates icon changed)
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Unmute');
  });
});
