import { FC, useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  onProgress: (currentProgress: number) => void;
  onPlayPause: () => void;
}

export const AudioPlayer: FC<AudioPlayerProps> = ({ src, onProgress, onPlayPause }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      if (!isDragging && audioRef.current) {
        const progress = audioRef.current.currentTime / duration;
        setCurrentTime(audioRef.current.currentTime);
        onProgress(progress);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isDragging, duration]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      onPlayPause();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const newTime = percent * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSkipBack = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, currentTime - 10);
  };

  const handleSkipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(duration, currentTime + 10);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Barre de progression */}
      <div
        className="relative w-full h-1 bg-white/10 rounded-full mb-4 cursor-pointer"
        onClick={handleSeek}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <div
          className={`absolute left-0 top-0 h-full bg-gradient-to-r to-blue-500 from-blue-900 rounded-full`}
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-pointer"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      {/* Temps */}
      <div className="flex justify-between text-sm text-white/50 mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Contrôles */}
      <div className="flex items-center justify-center gap-8">
        <button
          className="text-white/70 hover:text-white transition-colors"
          onClick={handleSkipBack}
        >
          <SkipBack className="w-8 h-8" />
        </button>
        <button
          className={`w-16 h-16 rounded-full bg-gradient-to-r to-blue-500 from-blue-900 flex items-center justify-center hover:scale-105 transition-transform`}
          onClick={togglePlayPause}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white" />
          )}
        </button>
        <button
          className="text-white/70 hover:text-white transition-colors"
          onClick={handleSkipForward}
        >
          <SkipForward className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
