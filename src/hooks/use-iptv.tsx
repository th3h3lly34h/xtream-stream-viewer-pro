
import { useState, useCallback } from 'react';
import { Category, Channel, VodItem, SeriesItem, IPTVState, ContentType } from '@/types/iptv';
import { useToast } from '@/components/ui/use-toast';

interface Credentials {
  username: string;
  password: string;
  url: string;
}

export const useIPTV = () => {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [state, setState] = useState<IPTVState>({
    categories: {
      live: [],
      vod: [],
      series: []
    },
    selectedCategoryId: null,
    streams: {
      live: [],
      vod: [],
      series: []
    }
  });

  const fetchCategories = useCallback(async (type: ContentType) => {
    if (!credentials) return;
    const { username, password, url } = credentials;
    
    try {
      const action = `get_${type}_categories`;
      const response = await fetch(
        `${url}/player_api.php?username=${username}&password=${password}&action=${action}`
      );
      const categories = await response.json();
      
      setState(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          [type]: categories
        }
      }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to fetch ${type} categories`
      });
    }
  }, [credentials, toast]);

  const fetchStreamsByCategory = useCallback(async (type: ContentType, categoryId: string) => {
    if (!credentials) return;
    const { username, password, url } = credentials;
    
    try {
      const action = type === 'series' ? 'get_series' : 
                     type === 'vod' ? 'get_vod_streams' : 
                     'get_live_streams';
      
      const response = await fetch(
        `${url}/player_api.php?username=${username}&password=${password}&action=${action}&category_id=${categoryId}`
      );
      const streams = await response.json();
      
      setState(prev => ({
        ...prev,
        selectedCategoryId: categoryId,
        streams: {
          ...prev.streams,
          [type]: streams
        }
      }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to fetch ${type} streams`
      });
    }
  }, [credentials, toast]);

  const handleLogin = async (username: string, password: string, url: string) => {
    setIsLoading(true);
    try {
      const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      setCredentials({ username, password, url: baseUrl });
      
      // Fetch initial categories for all types
      await Promise.all([
        fetchCategories('live'),
        fetchCategories('vod'),
        fetchCategories('series')
      ]);

      toast({
        title: "Connected successfully",
        description: "Categories loaded successfully"
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Please check your credentials and try again"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    categories: state.categories,
    streams: state.streams,
    selectedCategoryId: state.selectedCategoryId,
    handleLogin,
    fetchStreamsByCategory
  };
};
