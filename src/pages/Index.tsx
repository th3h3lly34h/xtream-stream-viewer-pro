
import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import VideoPlayer from '../components/VideoPlayer';
import Sidebar from '../components/Sidebar';
import ContentTabs from '../components/ContentTabs';
import { ContentType, Channel, VodItem } from '@/types/iptv';
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
    handleLogin,
    fetchStreamsByCategory,
    credentials  // Add this line to get credentials
  } = useIPTV();

  const handleLoginSubmit = async (username: string, password: string, url: string) => {
    const success = await handleLogin(username, password, url);
    if (success) {
      setIsLoggedIn(true);
    }
  };

  const getStreamUrl = () => {
    if (!isLoggedIn || !credentials) return '';
    
    if (contentType === 'live' && selectedChannel) {
      return `${credentials.url}/live/${credentials.username}/${credentials.password}/${selectedChannel.stream_id}`;
    } else if (contentType === 'vod' && selectedVod) {
      return `${credentials.url}/movie/${credentials.username}/${credentials.password}/${selectedVod.stream_id}.${selectedVod.container_extension}`;
    }
    return '';
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
      <div className="grid grid-cols-[300px_1fr] gap-4">
        <Sidebar
          contentType={contentType}
          categories={categories[contentType]}
          streams={streams[contentType]}
          onCategorySelect={(categoryId) => fetchStreamsByCategory(contentType, categoryId)}
          selectedCategoryId={selectedCategoryId}
          onChannelSelect={setSelectedChannel}
          onVodSelect={setSelectedVod}
          selectedChannelId={selectedChannel?.stream_id}
          selectedVodId={selectedVod?.stream_id}
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
