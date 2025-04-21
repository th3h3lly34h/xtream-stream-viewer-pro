
export interface Channel {
  stream_id: number;
  name: string;
  stream_icon: string;
}

export interface VodItem {
  stream_id: number;
  name: string;
  stream_icon: string;
  container_extension: string;
  title: string;
  plot: string | null;
  rating: string | null;
  releaseDate: string | null;
}

export interface SeriesItem {
  series_id: number;  // Changed from stream_id to series_id
  name: string;
  cover: string;
  plot: string | null;
  rating: string | null;
  releaseDate: string | null;
}

export interface Episode {
  id: number;
  season_number: number;
  episode_number: number;
  title: string;
  container_extension: string;
}

export interface Category {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface LiveCategory extends Category {}
export interface VodCategory extends Category {}
export interface SeriesCategory extends Category {}

export type ContentType = 'live' | 'vod' | 'series';

export interface IPTVState {
  categories: {
    live: LiveCategory[];
    vod: VodCategory[];
    series: SeriesCategory[];
  };
  selectedCategoryId: string | null;
  streams: {
    live: Channel[];
    vod: VodItem[];
    series: SeriesItem[];
  };
}

export interface Credentials {
  username: string;
  password: string;
  url: string;
}
