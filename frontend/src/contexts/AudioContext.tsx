import React, { createContext, useContext, useRef, RefObject } from 'react';

/**
 * Type definition for the Audio Context.
 * Holds a reference to the shared <audio> element.
 */
type AudioContextType = {
  audioRef: RefObject<HTMLAudioElement>;
};

const AudioContext = createContext<AudioContextType | null>(null);


/**
 * AudioProvider
 *
 * Wrap JukeboxAreaWrapper with AudioProvider to give children access to a shared <audio> element.
 *
 * @param {React.ReactNode} children - React children components
 * @returns {JSX.Element} The provider wrapping children
 */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <AudioContext.Provider value={{ audioRef }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}