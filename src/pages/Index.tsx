import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import VideoPlayer from '../components/VideoPlayer';
import Sidebar from '../components/Sidebar';
import ContentTabs from '../components/ContentTabs';
import { useToast } from '@/components/ui/use-toast';
import { Channel, ContentType, VodItem, SeriesItem } from '@/types/iptv';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState<ContentType>('live');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [vods, setVods] = useState<VodItem[]>([]);
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedVod, setSelectedVod] = useState<VodItem | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<SeriesItem | null>(null);
  const [credentials, setCredentials] = useState<{ username: string; password: string; url: string } | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogin = async (username: string, password: string, url: string) => {
    setIsLoading(true);
    try {
      const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      const apis = ['get_live_streams', 'get_vod_streams', 'get_series'];
      const results = await Promise.all(
        apis.map(action =>
          fetch(`${baseUrl}/player_api.php?username=${username}&password=${password}&action=${action}`)
            .then(res => res.json())
        )
      );

      setChannels(results[0]);
      setVods(results[1]);
      setSeries(results[2]);
      setCredentials({ username, password, url: baseUrl });
      setIsLoggedIn(true);
      
      toast({
        title: "Connected successfully",
        description: `Found ${results[0].length} channels, ${results[1].length} movies, and ${results[2].length} series`,
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

  const getStreamUrl = () => {
    if (!credentials) return '';
    const { url, username, password } = credentials;
    
    if (contentType === 'live' && selectedChannel) {
      return `${url}/live/${username}/${password}/${selectedChannel.stream_id}`;
    } else if (contentType === 'vod' && selectedVod) {
      return `${url}/movie/${username}/${password}/${selectedVod.stream_id}.${selectedVod.container_extension}`;
    }
    return '';
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
        <Sidebar
          channels={channels}
          onChannelSelect={setSelectedChannel}
          selectedChannelId={selectedChannel?.stream_id}
          isMobile={isMobile}
        />
        <div className="space-y-4">
          <ContentTabs activeType={contentType} onTypeChange={setContentType} />
          {(selectedChannel || selectedVod) ? (
            <>
              <VideoPlayer
                url={getStreamUrl()}
                title={selectedChannel?.name || selectedVod?.name || ''}
              />
              <h2 className="text-xl font-bold">
                {selectedChannel?.name || selectedVod?.name || ''}
              </h2>
              {selectedVod?.plot && (
                <p className="text-muted-foreground">{selectedVod.plot}</p>
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">
                {contentType === 'live' ? 'Select a channel to start watching' :
                 contentType === 'vod' ? 'Select a movie to start watching' :
                 'Select a series to start watching'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
