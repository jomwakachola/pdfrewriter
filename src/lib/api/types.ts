export interface TwitterContent {
  id: number;
  topic: string;
}

export interface RewriteResponse {
  twitter_content: TwitterContent[];
  success?: boolean;
  message?: string;
  error?: string;
}

export interface RewriteHistory {
  id: string;
  fileName: string;
  fileSize: number;
  timestamp: string;
  status: 'completed' | 'failed';
  versions: TwitterContent[];
}