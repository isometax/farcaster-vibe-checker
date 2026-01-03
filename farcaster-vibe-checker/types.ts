
export interface FarcasterUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  follower_count?: number;
  following_count?: number;
  bio?: string;
}

export interface AnalysisResult {
  vibe: 'cool' | 'spam' | 'inactive' | 'high-value';
  reason: string;
  recommendation: 'keep' | 'unfollow' | 'watch';
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
