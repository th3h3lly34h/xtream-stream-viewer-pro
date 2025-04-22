import { useState, useCallback, useEffect } from 'react';
import { Category, Channel, VodItem, SeriesItem, IPTVState, ContentType, Credentials, SeriesDetails } from '@/types/iptv';
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
    },
    selectedSeries: null
  });

  const fetchWithCorsHandling = useCallback(async (url: string) => {
    try {
      console.log(`Fetching: ${url}`);
      
      // Ensure URL is using HTTP protocol
      let fetchUrl = url;
      if (fetchUrl.startsWith('https://')) {
        fetchUrl = fetchUrl.replace('https://', 'http://');
        console.log('Converted HTTPS to HTTP:', fetchUrl);
      }
      
      // Attempt with HTTP URL
      const response = await fetch(fetchUrl, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Fetch error:`, error);
      throw error;
    }
  }, []);

  const fetchSeriesInfo = useCallback(async (seriesId: number) => {
    if (!credentials) return null;
    const { username, password, url } = credentials;
    
    try {
      console.log(`Fetching series info for series ${seriesId}`);
      const apiUrl = `${url}/player_api.php?username=${username}&password=${password}&action=get_series_info&series_id=${seriesId}`;
      
      const seriesInfo: SeriesDetails = await fetchWithCorsHandling(apiUrl);
      console.log(`Received series info:`, seriesInfo);
      
      setState(prev => ({
        ...prev,
        selectedSeries: seriesInfo
      }));
      
      return seriesInfo;
    } catch (error) {
      console.error(`Error fetching series info:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to fetch series info`
      });
      return null;
    }
  }, [credentials, toast, fetchWithCorsHandling]);

  const fetchCategories = useCallback(async (type: ContentType) => {
    if (!credentials) return;
    const { username, password, url } = credentials;
    
    try {
      const action = `get_${type}_categories`;
      console.log(`Fetching ${type} categories`);
      const apiUrl = `${url}/player_api.php?username=${username}&password=${password}&action=${action}`;
      
      const categories = await fetchWithCorsHandling(apiUrl);
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
  }, [credentials, toast, fetchWithCorsHandling]);

  const fetchStreamsByCategory = useCallback(async (type: ContentType, categoryId: string) => {
    if (!credentials) return;
    const { username, password, url } = credentials;
    
    try {
      const action = type === 'series' ? 'get_series' : 
                     type === 'vod' ? 'get_vod_streams' : 
                     'get_live_streams';
      
      console.log(`Fetching ${type} streams for category ${categoryId}`);
      const apiUrl = `${url}/player_api.php?username=${username}&password=${password}&action=${action}&category_id=${categoryId}`;
      
      const streams = await fetchWithCorsHandling(apiUrl);
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
  }, [credentials, toast, fetchWithCorsHandling]);

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
      
      // Ensure URL is using HTTP protocol
      let baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      if (baseUrl.startsWith('https://')) {
        baseUrl = baseUrl.replace('https://', 'http://');
        console.log('Converted HTTPS to HTTP:', baseUrl);
      }
      
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

  const fetchVodInfo = useCallback(async (vodId: number) => {
    if (!credentials) return null;
    const { username, password, url } = credentials;
    
    try {
      console.log(`Fetching VOD info for VOD ${vodId}`);
      const apiUrl = `${url}/player_api.php?username=${username}&password=${password}&action=get_vod_info&vod_id=${vodId}`;
      
      const vodInfo = await fetchWithCorsHandling(apiUrl);
      console.log(`Received VOD info:`, vodInfo);
      
      if (!vodInfo) {
        throw new Error('No VOD info received');
      }

      // Add video URL to the VOD info
      const videoUrl = `${url}/movie/${username}/${password}/${vodId}.${vodInfo.container_extension || 'mp4'}`;
      
      return {
        ...vodInfo,
        video_url: videoUrl
      };
    } catch (error) {
      console.error(`Error fetching VOD info:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to fetch VOD information`
      });
      return null;
    }
  }, [credentials, toast, fetchWithCorsHandling]);

  return {
    isLoading,
    categories: state.categories,
    streams: state.streams,
    selectedCategoryId: state.selectedCategoryId,
    selectedSeries: state.selectedSeries,
    handleLogin,
    fetchStreamsByCategory,
    fetchSeriesInfo,
    credentials,
    fetchVodInfo,
  };
};
