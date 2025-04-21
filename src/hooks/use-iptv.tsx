
import { useState, useCallback, useEffect } from 'react';
import { Category, Channel, VodItem, SeriesItem, IPTVState, ContentType, Credentials } from '@/types/iptv';
import { useToast } from '@/components/ui/use-toast';

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
      console.log(`Fetching ${type} categories from: ${url}/player_api.php?username=${username}&password=${password}&action=${action}`);
      
      const response = await fetch(
        `${url}/player_api.php?username=${username}&password=${password}&action=${action}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const categories = await response.json();
      console.log(`Received ${type} categories:`, categories);
      
      setState(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          [type]: categories
        }
      }));
      
      return categories;
    } catch (error) {
      console.error(`Error fetching ${type} categories:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to fetch ${type} categories`
      });
      return [];
    }
  }, [credentials, toast]);

  const fetchStreamsByCategory = useCallback(async (type: ContentType, categoryId: string) => {
    if (!credentials) return;
    const { username, password, url } = credentials;
    
    try {
      const action = type === 'series' ? 'get_series' : 
                     type === 'vod' ? 'get_vod_streams' : 
                     'get_live_streams';
      
      console.log(`Fetching ${type} streams for category ${categoryId} from: ${url}/player_api.php?username=${username}&password=${password}&action=${action}&category_id=${categoryId}`);
      
      const response = await fetch(
        `${url}/player_api.php?username=${username}&password=${password}&action=${action}&category_id=${categoryId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const streams = await response.json();
      console.log(`Received ${type} streams for category ${categoryId}:`, streams);
      
      setState(prev => ({
        ...prev,
        selectedCategoryId: categoryId,
        streams: {
          ...prev.streams,
          [type]: streams
        }
      }));
      
      return streams;
    } catch (error) {
      console.error(`Error fetching ${type} streams:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to fetch ${type} streams`
      });
      return [];
    }
  }, [credentials, toast]);

  // Add useEffect to fetch categories whenever credentials change
  useEffect(() => {
    if (credentials) {
      console.log("Credentials updated, fetching all categories");
      Promise.all([
        fetchCategories('live'),
        fetchCategories('vod'),
        fetchCategories('series')
      ]).catch(err => {
        console.error("Error fetching initial categories:", err);
      });
    }
  }, [credentials, fetchCategories]);

  const handleLogin = async (username: string, password: string, url: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", { username, url });
      const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      
      // Update credentials first
      setCredentials({ username, password, url: baseUrl });
      
      toast({
        title: "Connected successfully",
        description: "Loading categories..."
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
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
    fetchStreamsByCategory,
    credentials
  };
};
