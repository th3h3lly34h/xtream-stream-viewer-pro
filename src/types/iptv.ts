
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
  series_id: number;
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

export type ContentType = 'live' | 'vod' | 'series';
