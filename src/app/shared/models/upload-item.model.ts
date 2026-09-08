export interface UploadItem {
  localId: string;
  file: File | null;          // null once we only have server data (e.g. loaded existing image)
  previewUrl: string;
  progress: number;
  status: 'pending' | 'uploading' | 'uploaded' | 'failed';
  assetId?: string;
  serverUrl?: string;
  error?: string;
  isPrimary?: boolean;        // only relevant in multi mode
}