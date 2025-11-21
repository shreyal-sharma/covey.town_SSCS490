import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import MuteButton from './MuteButton';
import React from 'react';
import { AudioProvider } from '../../../contexts/AudioContext';

// Wrapper for Chakra UI and AudioProvider
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ChakraProvider>
      <AudioProvider>{component}</AudioProvider>
    </ChakraProvider>
  );
};

describe('MuteButton', () => {
  test('renders the mute button', () => {
    renderWithProviders(<MuteButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('initially displays Mute label when not muted', () => {
    renderWithProviders(<MuteButton />);
    const button = screen.getByRole('button', { name: 'Mute' });
    expect(button).toBeInTheDocument();
  });
});