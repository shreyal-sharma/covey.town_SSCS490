import { IconButton } from '@chakra-ui/react';
import React, { useState, useRef, useEffect } from 'react';

/**
 * SVG Icons from Google Material Design Icons
 * Source: https://fonts.google.com/icons
 * License: Apache License 2.0
 * Icons used: volume_up, volume_off
 */

// SVG icons as components
const VolumeUpIcon = () => (
  // volume_up icon from Material Design Icons
  <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z' />
  </svg>
);

const VolumeMuteIcon = () => (
  // volume_off icon from Material Design Icons
  <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z' />
  </svg>
);

/**
 * MuteButton Component
 *
 * A global mute button for the Jukebox feature that appears in the top-right corner of the Covey Town
 *
 * Current Implementation:
 * - Uses mock audio reference for testing mute functionality
 * - Toggles mute state and updates UI accordingly
 * - Displays debug indicator showing mock audio state
 *
 * TODO for Audio Integration:
 * - Replace mockAudioRef with actual audio element from JukeboxAreaController
 * - Connect to real audio playback when playlist feature is implemented
 * - Remove debug indicator when audio is integrated
 *
 * @returns A fixed-position IconButton that toggles mute state
 */
export default function MuteButton(): JSX.Element {
  const [isMuted, setIsMuted] = useState(false);

  // Mock audio reference - will be replaced with real audio element later
  const mockAudioRef = useRef<{ muted: boolean }>({ muted: false });

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;

    // Update mock audio state
    mockAudioRef.current.muted = newMutedState;

    // Update UI state
    setIsMuted(newMutedState);

    console.log('Mute button clicked. Muted:', newMutedState);
    console.log('Mock audio muted state:', mockAudioRef.current.muted);
  };

  // When real audio is implemented, this effect will sync with actual audio element
  useEffect(() => {
    // TODO: Replace with actual audio element when available
    // const audioElement = document.getElementById('jukebox-audio') as HTMLAudioElement;
    // if (audioElement) {
    //   audioElement.muted = isMuted;
    // }

    console.log('Audio mute state updated:', isMuted);
  }, [isMuted]);

  return (
    <>
      <IconButton
        icon={isMuted ? <VolumeMuteIcon /> : <VolumeUpIcon />}
        onClick={handleMuteToggle}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        position='fixed'
        top='50px'
        right='300px'
        zIndex={9999}
        size='lg'
        colorScheme='whiteAlpha'
        color='white'
        bg='blackAlpha.600'
        isRound
        boxShadow='lg'
      />

      {/* Debug Indicator - Shows mock audio state */}
      {/* TODO: Remove this when real audio is integrated */}
      <div
        style={{
          position: 'fixed',
          top: '120px',
          right: '280px',
          background: isMuted ? 'rgba(220, 38, 38, 0.9)' : 'rgba(34, 197, 94, 0.9)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 'bold',
          zIndex: 9999,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          border: '2px solid white',
          minWidth: '180px',
        }}>
        <div style={{ fontSize: '15px' }}>🔊 {isMuted ? 'MUTED' : 'UNMUTED'}</div>
      </div>
    </>
  );
}
