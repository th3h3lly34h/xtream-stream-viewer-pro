
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import ChannelList from './ChannelList';
import { Channel } from '@/types/iptv';

interface SidebarProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
  selectedChannelId?: number;
  isMobile?: boolean;
}

const Sidebar = ({ channels, onChannelSelect, selectedChannelId, isMobile }: SidebarProps) => {
  const content = (
    <ChannelList
      channels={channels}
      onChannelSelect={onChannelSelect}
      selectedChannelId={selectedChannelId}
    />
  );

  if (isMobile) {
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
