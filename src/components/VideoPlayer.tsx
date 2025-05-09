
import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Fullscreen, Minimize, Play, Pause } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VideoPlayerProps {
  url: string;
  title: string;
  streamIcon?: string;
}

const VideoPlayer = ({ url: initialUrl, title, streamIcon }: VideoPlayerProps) => {
  const [url, setUrl] = useState(initialUrl);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const { toast } = useToast();
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<ReactPlayer | null>(null);

  // Update URL when initialUrl changes
  useEffect(() => {
    setUrl(initialUrl);
    setError(null);
    setReady(false);
  }, [initialUrl]);

  // Add event listener for fullscreenchange
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    setMuted(!muted);
  };

  const handleFullscreenToggle = () => {
    try {
      if (!playerContainerRef.current) return;

      if (!document.fullscreenElement) {
        playerContainerRef.current.requestFullscreen().catch(err => {
          console.error('Error attempting to enable fullscreen:', err);
        });
      } else {
        document.exitFullscreen().catch(err => {
          console.error('Error attempting to exit fullscreen:', err);
        });
      }
    } catch (err) {
      console.error('Fullscreen API error:', err);
    }
  };

  const handlePlayerError = (e: any) => {
    console.error('Player error:', e);
    setError('Failed to load stream. This may be due to CORS restrictions or an invalid stream URL.');
    toast({
      title: "Playback Error",
      description: "There was a problem loading the stream. Please check your connection or try again later.",
      variant: "destructive"
    });
  };

  const handlePlayerReady = () => {
    setReady(true);
    setError(null);
    console.log('Stream loaded successfully');
  };

  return (
    <Card className="w-full bg-black relative group">
      <div ref={playerContainerRef} className="aspect-video relative">
        {url ? (
          <ReactPlayer
            ref={playerRef}
            url={url}
            playing={playing}
            volume={volume}
            muted={muted}
            width="100%"
            height="100%"
            onError={handlePlayerError}
            onReady={handlePlayerReady}
            config={{
              file: {
                forceHLS: true,
                attributes: {
                  crossOrigin: "anonymous",
                  controlsList: "nodownload",
                },
                hlsOptions: {
                  enableWorker: true,
                  lowLatencyMode: true,
                  liveSyncDuration: 3,
                  liveMaxLatencyDuration: 10,
                  liveDurationInfinity: true,
                  maxBufferLength: 30,
                  maxMaxBufferLength: 600,
                  backBufferLength: 90,
                  maxLoadingDelay: 4,
                  minAutoBitrate: 0,
                  abrEwmaDefaultEstimate: 500000,
                  startLevel: -1,
                  fragLoadingMaxRetry: 6,
                  manifestLoadingMaxRetry: 6,
                  levelLoadingMaxRetry: 6,
                  progressive: true,
                  forceHLS: true,
                  xhrSetup: function(xhr: XMLHttpRequest) {
                    xhr.withCredentials = false;
                  }
                },
              },
            }}
            playsinline
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-black/90">
            {streamIcon ? (
              <img 
                src={streamIcon} 
                alt={title} 
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a';
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <p className="text-white">Select a stream to play</p>
            )}
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <p className="text-white">{error}</p>
          </div>
        )}
        
        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:text-white/80"
              onClick={handlePlayPause}
              disabled={!ready || !!error}
            >
              {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80"
                onClick={handleMuteToggle}
                disabled={!ready || !!error}
              >
                {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24"
                disabled={!ready || !!error}
              />
            </div>

            <div className="ml-auto">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80"
                onClick={handleFullscreenToggle}
                disabled={!ready || !!error}
              >
                {isFullscreen ? (
                  <Minimize className="h-6 w-6" />
                ) : (
                  <Fullscreen className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;
