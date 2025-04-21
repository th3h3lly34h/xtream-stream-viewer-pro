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

export interface SeriesInfo {
  name: string;
  cover: string;
  plot: string | null;
  cast: string | null;
  director: string | null;
  genre: string | null;
  releaseDate: string | null;
  rating: string | null;
  rating_5based: number;
  backdrop_path: string[];
  youtube_trailer: string | null;
  episode_run_time: string | null;
  category_id: string | null;
}

export interface Episode {
  id: number;
  episode_num: number;
  title: string;
  container_extension: string;
  season: number;
  info: any; // You can type this more specifically if needed
  custom_sid: string;
  added: string;
  direct_source: string;
}

export interface SeriesDetails {
  seasons: number[];
  info: SeriesInfo;
  episodes: { [key: string]: Episode[] };
}

export interface SeriesItem {
  series_id: number;  // Changed from stream_id to series_id
  name: string;
  cover: string;
  plot: string | null;
  rating: string | null;
  releaseDate: string | null;
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
  selectedSeries: SeriesDetails | null;
}

export interface Credentials {
  username: string;
  password: string;
  url: string;
}
