import { useAudioContext } from "../context/AudioContext";

export function useSound() {
  const audio = useAudioContext();
  return {
    audioEnabled: audio.audioEnabled,
    toggleAudio: audio.toggleAudio,
    playHover: audio.playHover,
    playClick: audio.playClick,
    playNav: audio.playNav,
    playCardHover: audio.playCardHover,
    playToggleSound: audio.playToggleSound,
  };
}

