
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import LoginForm from '../components/LoginForm';
import VideoPlayer from '../components/VideoPlayer';
import Sidebar from '../components/Sidebar';
import ContentTabs from '../components/ContentTabs';
import StreamGrid from '@/components/StreamGrid';
import { ContentType, Channel, VodItem, SeriesItem } from '@/types/iptv';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIPTV } from '@/hooks/use-iptv';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contentType, setContentType] = useState<ContentType>('live');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedVod, setSelectedVod] = useState<VodItem | null>(null);
  const isMobile = useIsMobile();
  
  const {
    isLoading,
    categories,
    streams,
    selectedCategoryId,
    selectedSeries,
    handleLogin,
    fetchStreamsByCategory,
    fetchSeriesInfo,
    credentials
  } = useIPTV();

  const handleLoginSubmit = async (username: string, password: string, url: string) => {
    const success = await handleLogin(username, password, url);
    if (success) {
      setIsLoggedIn(true);
    }
  };

  const handleSeriesSelect = async (series: SeriesItem) => {
    await fetchSeriesInfo(series.series_id);
  };

  const handleChannelSelect = useCallback((channel: Channel) => {
    console.log("Selected channel:", channel);
    setSelectedChannel(channel);
  }, []);

  const handleVodSelect = useCallback((vod: VodItem) => {
    console.log("Selected VOD:", vod);
    setSelectedVod(vod);
  }, []);

  const getStreamUrl = useCallback(() => {
    if (!isLoggedIn || !credentials) return '';
    
    if (contentType === 'live' && selectedChannel) {
      const streamUrl = `${credentials.url}/live/${credentials.username}/${credentials.password}/${selectedChannel.stream_id}.m3u8`;
      console.log("Generated live stream URL:", streamUrl);
      return streamUrl;
    } else if (contentType === 'vod' && selectedVod) {
      let extension = selectedVod.container_extension || 'mp4';
      // Ensure extension doesn't start with a dot to avoid double dots
      if (extension.startsWith('.')) {
        extension = extension.substring(1);
      }
      const streamUrl = `${credentials.url}/movie/${credentials.username}/${credentials.password}/${selectedVod.stream_id}.${extension}`;
      console.log("Generated VOD stream URL:", streamUrl);
      return streamUrl;
    }
    return '';
  }, [isLoggedIn, credentials, contentType, selectedChannel, selectedVod]);

  const renderContent = () => {
    if (contentType === 'live') {
      return (
        <div className="space-y-2">
          {streams.live.map((channel) => (
            <Button
              key={channel.stream_id}
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => handleChannelSelect(channel)}
            >
              {channel.name}
            </Button>
          ))}
        </div>
      );
    }

    return (
      <StreamGrid
        items={streams[contentType]}
        onSelect={(item) => {
          if (contentType === 'vod') {
            handleVodSelect(item as VodItem);
          } else if (contentType === 'series') {
            handleSeriesSelect(item as SeriesItem);
          }
        }}
        type={contentType as 'vod' | 'series'}
      />
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoginForm onLogin={handleLoginSubmit} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
        <Sidebar
          contentType={contentType}
          categories={categories[contentType]}
          streams={streams[contentType]}
          onCategorySelect={(categoryId) => fetchStreamsByCategory(contentType, categoryId)}
          selectedCategoryId={selectedCategoryId}
          onChannelSelect={handleChannelSelect}
          onVodSelect={handleVodSelect}
          onSeriesSelect={handleSeriesSelect}
          selectedChannelId={selectedChannel?.stream_id}
          selectedVodId={selectedVod?.stream_id}
          isMobile={isMobile}
        />
        <div className="space-y-4">
          <ContentTabs activeType={contentType} onTypeChange={(type) => {
            setContentType(type);
            // Reset selections when changing content type
            if (type !== 'live') setSelectedChannel(null);
            if (type !== 'vod') setSelectedVod(null);
          }} />
          
          {selectedCategoryId && renderContent()}
          
          {(selectedChannel || selectedVod || selectedSeries) && (
            <>
              {(contentType !== 'series' || !selectedSeries) ? (
                <>
                  <VideoPlayer
                    url={getStreamUrl()}
                    title={selectedChannel?.name || selectedVod?.name || ''}
                    streamIcon={selectedChannel?.stream_icon || selectedVod?.stream_icon}
                  />
                  <h2 className="text-xl font-bold">
                    {selectedChannel?.name || selectedVod?.name || ''}
                  </h2>
                  {selectedVod?.plot && (
                    <p className="text-muted-foreground">{selectedVod.plot}</p>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">{selectedSeries.info.name}</h2>
                  {selectedSeries.info.plot && (
                    <p className="text-muted-foreground">{selectedSeries.info.plot}</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedSeries.seasons.map((season) => (
                      <div key={season} className="space-y-2">
                        <h3 className="font-semibold">Season {season}</h3>
                        {selectedSeries.episodes[season]?.map((episode) => (
                          <Button
                            key={episode.id}
                            variant="outline"
                            className="w-full text-left"
                            onClick={() => {
                              // Handle episode selection
                            }}
                          >
                            {episode.episode_num}. {episode.title}
                          </Button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
