
import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import VideoPlayer from '../components/VideoPlayer';
import ChannelList from '../components/ChannelList';
import { useToast } from '@/components/ui/use-toast';

interface Channel {
  stream_id: number;
  name: string;
  stream_icon: string;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [credentials, setCredentials] = useState<{ username: string; password: string; url: string } | null>(null);
  const { toast } = useToast();

  const handleLogin = async (username: string, password: string, url: string) => {
    setIsLoading(true);
    try {
      const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      const response = await fetch(`${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_live_streams`);
      
      if (!response.ok) {
        throw new Error('Failed to connect to the server');
      }

      const data = await response.json();
      setChannels(data);
      setCredentials({ username, password, url: baseUrl });
      setIsLoggedIn(true);
      
      toast({
        title: "Connected successfully",
        description: `Found ${data.length} channels`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
  };

  const getStreamUrl = () => {
    if (!selectedChannel || !credentials) return '';
    return `${credentials.url}/live/${credentials.username}/${credentials.password}/${selectedChannel.stream_id}`;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="grid grid-cols-[300px_1fr] gap-4">
        <div className="h-[calc(100vh-2rem)]">
          <ChannelList
            channels={channels}
            onChannelSelect={handleChannelSelect}
            selectedChannelId={selectedChannel?.stream_id}
          />
        </div>
        <div className="space-y-4">
          {selectedChannel ? (
            <>
              <VideoPlayer
                url={getStreamUrl()}
                title={selectedChannel.name}
              />
              <h2 className="text-xl font-bold">{selectedChannel.name}</h2>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Select a channel to start watching</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
