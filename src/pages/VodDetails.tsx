
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useIPTV } from '@/hooks/use-iptv';
import VideoPlayer from '@/components/VideoPlayer';

const VodDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vodInfo } = location.state || {};

  if (!vodInfo) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p>No VOD information available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <VideoPlayer 
        url={vodInfo.video_url}
        title={vodInfo.name}
        streamIcon={vodInfo.stream_icon}
      />

      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">{vodInfo.name}</h1>
        {vodInfo.plot && (
          <p className="text-gray-600 mb-4">{vodInfo.plot}</p>
        )}
        <div className="grid grid-cols-2 gap-4">
          {vodInfo.releaseDate && (
            <div>
              <span className="font-semibold">Release Date:</span> {vodInfo.releaseDate}
            </div>
          )}
          {vodInfo.rating && (
            <div>
              <span className="font-semibold">Rating:</span> {vodInfo.rating}
            </div>
          )}
          {vodInfo.duration && (
            <div>
              <span className="font-semibold">Duration:</span> {vodInfo.duration}
            </div>
          )}
          {vodInfo.director && (
            <div>
              <span className="font-semibold">Director:</span> {vodInfo.director}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VodDetails;
