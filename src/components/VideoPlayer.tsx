
import React from 'react';
import ReactPlayer from 'react-player';
import { Card } from "@/components/ui/card";

interface VideoPlayerProps {
  url: string;
  title: string;
}

const VideoPlayer = ({ url, title }: VideoPlayerProps) => {
  return (
    <Card className="w-full aspect-video bg-black">
      <ReactPlayer
        url={url}
        playing
        controls
        width="100%"
        height="100%"
        config={{
          file: {
            forceHLS: true,
          }
        }}
      />
    </Card>
  );
};

export default VideoPlayer;
