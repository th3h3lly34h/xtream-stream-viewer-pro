
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Tv, Video } from "lucide-react";
import { ContentType } from "@/types/iptv";

interface ContentTabsProps {
  activeType: ContentType;
  onTypeChange: (type: ContentType) => void;
}

const ContentTabs = ({ activeType, onTypeChange }: ContentTabsProps) => {
  return (
    <Tabs value={activeType} onValueChange={(value) => onTypeChange(value as ContentType)}>
      <TabsList className="mb-4">
        <TabsTrigger value="live" className="flex items-center gap-2">
          <Tv className="h-4 w-4" />
          Live TV
        </TabsTrigger>
        <TabsTrigger value="vod" className="flex items-center gap-2">
          <Film className="h-4 w-4" />
          Movies
        </TabsTrigger>
        <TabsTrigger value="series" className="flex items-center gap-2">
          <Video className="h-4 w-4" />
          Series
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ContentTabs;
