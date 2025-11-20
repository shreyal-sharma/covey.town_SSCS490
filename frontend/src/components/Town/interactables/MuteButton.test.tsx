import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import MuteButton from './MuteButton';
import React from 'react';

// Wrapper for Chakra UI components
const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('MuteButton - UI Rendering', () => {
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

  test('renders debug indicator box', () => {
    const { container } = renderWithChakra(<MuteButton />);
    const debugBox = container.querySelector('div[style*="position: fixed"]');
    expect(debugBox).toBeInTheDocument();
  });
});

describe('MuteButton - Mute Functionality', () => {
  test('toggles to Unmute label after clicking', () => {
    renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button', { name: 'Mute' });

    fireEvent.click(button);

    expect(screen.getByRole('button', { name: 'Unmute' })).toBeInTheDocument();
  });

  test('toggles back to Mute label after clicking twice', () => {
    renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button');

    fireEvent.click(button); // mute
    expect(screen.getByRole('button', { name: 'Unmute' })).toBeInTheDocument();

    fireEvent.click(button); // unmute
    expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument();
  });

  test('handles multiple rapid toggles correctly', () => {
    renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument();
  });
});

describe('MuteButton - Icon Changes', () => {
  test('displays VolumeUpIcon initially', () => {
    const { container } = renderWithChakra(<MuteButton />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  test('changes icon after clicking', () => {
    renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-label', 'Mute');

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-label', 'Unmute');
  });

  test('toggles indicator text between MUTED and UNMUTED', () => {
    renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button');

    expect(screen.getByText(/UNMUTED/i)).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText(/MUTED/i)).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText(/UNMUTED/i)).toBeInTheDocument();
  });

  test('indicator background color changes based on mute state', () => {
    const { container } = renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button');

    const indicator = container.querySelector('div[style*="position: fixed"]');

    expect(indicator).toHaveStyle({ background: 'rgba(34, 197, 94, 0.9)' });

    fireEvent.click(button);

    expect(indicator).toHaveStyle({ background: 'rgba(220, 38, 38, 0.9)' });
  });
});

describe('MuteButton - Mock Audio Integration', () => {
  test('mock audio state changes with button clicks', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith('Mock audio muted state:', true);

    fireEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith('Mock audio muted state:', false);

    consoleSpy.mockRestore();
  });

  test('useEffect triggers on state change', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button');

    consoleSpy.mockClear();
    fireEvent.click(button);

    expect(consoleSpy).toHaveBeenCalledWith('Audio mute state updated:', true);

    consoleSpy.mockRestore();
  });
});

describe('MuteButton - Edge Cases', () => {
  test('handles rapid successive clicks correctly', () => {
    renderWithChakra(<MuteButton />);
    const button = screen.getByRole('button');

    for (let i = 0; i < 10; i++) {
      fireEvent.click(button);
    }

    // 10 clicks = even → should end unmuted
    expect(screen.getByText(/UNMUTED/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument();
  });
});
