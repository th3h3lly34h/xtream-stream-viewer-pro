
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Channel {
  stream_id: number;
  name: string;
  stream_icon: string;
}

interface ChannelListProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
  selectedChannelId?: number;
}

const ChannelList = ({ channels, onChannelSelect, selectedChannelId }: ChannelListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-2rem)] pr-4">
      <div className="space-y-2">
        {channels.map((channel) => (
          <Button
            key={channel.stream_id}
            onClick={() => onChannelSelect(channel)}
            variant={selectedChannelId === channel.stream_id ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            {channel.stream_icon && (
              <img
                src={channel.stream_icon}
                alt={channel.name}
                className="w-6 h-6 mr-2 rounded"
              />
            )}
            <span className="truncate">{channel.name}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChannelList;
