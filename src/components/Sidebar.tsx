import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category, Channel, VodItem, SeriesItem, ContentType } from '@/types/iptv';

interface SidebarProps {
  contentType: ContentType;
  categories: Category[];
  streams: Channel[] | VodItem[] | SeriesItem[];
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
  contentType,
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
}: Omit<SidebarProps, 'isMobile'>) => {

  if (contentType === 'live' && selectedCategoryId && streams.length > 0) {
    return (
      <ScrollArea className="h-[calc(100vh-2rem)]">
        <div className="space-y-2 p-4">
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={() => onCategorySelect('')}
          >
            Back to Categories
          </Button>
          {streams.map((stream) => {
            const channel = stream as Channel;
            return (
              <Button
                key={channel.stream_id}
                variant={selectedChannelId === channel.stream_id ? "secondary" : "ghost"}
                className="w-full justify-start items-center gap-2"
                onClick={() => onChannelSelect?.(channel)}
              >
                {channel.stream_icon && (
                  <img
                    src={channel.stream_icon}
                    alt={channel.name}
                    className="w-8 h-8 rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a';
                    }}
                  />
                )}
                <span className="truncate">{channel.name}</span>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    );
  }

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
