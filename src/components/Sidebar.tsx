
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category, Channel, VodItem, SeriesItem, ContentType } from '@/types/iptv';

interface SidebarProps {
  contentType: ContentType;
  categories: Category[];
  streams: (Channel | VodItem | SeriesItem)[];
  onCategorySelect: (categoryId: string) => void;
  selectedCategoryId?: string | null;
  onChannelSelect?: (channel: Channel) => void;
  onVodSelect?: (vod: VodItem) => void;
  onSeriesSelect?: (series: SeriesItem) => void;
  selectedChannelId?: number;
  selectedVodId?: number;
  selectedSeriesId?: number;
  isMobile?: boolean;
}

const SidebarContent = ({ 
  categories,
  streams,
  onCategorySelect,
  selectedCategoryId,
  onChannelSelect,
  onVodSelect,
  onSeriesSelect,
  selectedChannelId,
  selectedVodId,
  selectedSeriesId,
  contentType
}: Omit<SidebarProps, 'isMobile'>) => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Categories</h2>
          {categories.map((category) => (
            <Button
              key={category.category_id}
              variant={selectedCategoryId === category.category_id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onCategorySelect(category.category_id)}
            >
              {category.category_name}
            </Button>
          ))}
        </div>
        
        {selectedCategoryId && streams.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">
              {contentType === 'live' ? 'Channels' : 
               contentType === 'vod' ? 'Movies' : 'Series'}
            </h2>
            {streams.map((item) => (
              <Button
                key={item.stream_id}
                variant={
                  (contentType === 'live' && selectedChannelId === item.stream_id) ||
                  (contentType === 'vod' && selectedVodId === item.stream_id) ||
                  (contentType === 'series' && selectedSeriesId === (item as SeriesItem).series_id)
                    ? "secondary"
                    : "ghost"
                }
                className="w-full justify-start text-left"
                onClick={() => {
                  if (contentType === 'live' && onChannelSelect) {
                    onChannelSelect(item as Channel);
                  } else if (contentType === 'vod' && onVodSelect) {
                    onVodSelect(item as VodItem);
                  } else if (contentType === 'series' && onSeriesSelect) {
                    onSeriesSelect(item as SeriesItem);
                  }
                }}
              >
                {item.name}
              </Button>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

const Sidebar = (props: SidebarProps) => {
  const content = <SidebarContent {...props} />;

  if (props.isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <List className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="h-[calc(100vh-2rem)]">
      {content}
    </div>
  );
};

export default Sidebar;
