
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Channel, VodItem, SeriesItem } from '@/types/iptv';
import { Button } from '@/components/ui/button';
import { useIPTV } from '@/hooks/use-iptv';

interface StreamGridProps {
  items: (Channel | VodItem | SeriesItem)[];
  onSelect: (item: Channel | VodItem | SeriesItem) => void;
  type: 'vod' | 'series';
}

const StreamGrid = ({ items, onSelect, type }: StreamGridProps) => {
  const navigate = useNavigate();
  const { fetchVodInfo } = useIPTV();

  const handleItemClick = async (item: Channel | VodItem | SeriesItem) => {
    if (type === 'vod') {
      const vodItem = item as VodItem;
      const vodInfo = await fetchVodInfo(vodItem.stream_id);
      if (vodInfo) {
        navigate(`/vod/${vodItem.stream_id}`, { state: { vodInfo } });
      }
    } else {
      onSelect(item);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((item) => (
        <Button
          key={type === 'series' ? (item as SeriesItem).series_id : (item as Channel | VodItem).stream_id}
          variant="outline"
          className="h-auto p-0 overflow-hidden flex flex-col"
          onClick={() => handleItemClick(item)}
        >
          <div className="aspect-[2/3] w-full relative">
            <img
              src={type === 'series' ? (item as SeriesItem).cover : (item as Channel | VodItem).stream_icon}
              alt={item.name}
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
          <div className="p-2 text-left w-full">
            <p className="text-sm font-medium truncate">{item.name}</p>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default StreamGrid;
