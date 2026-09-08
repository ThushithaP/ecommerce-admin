import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, switchMap, map } from 'rxjs';

export interface PresignResponse {
  id: string;
  upload_url: string;
  object_key: string;
}

export interface MediaAsset {
  id: string;
  object_key: string;
  status: string;
  url: string | null;
  isPrimary: boolean;
}

@Injectable({ providedIn: 'root' })
export class MediaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/media`;

  presign(filename: string, contentType: string, folder: 'brands' | 'products'): Observable<PresignResponse> {
    return this.http.post<PresignResponse>(`${this.apiUrl}/presign/`, {
      filename, content_type: contentType, folder,
    });
  }

  uploadToS3(uploadUrl: string, file: File, onProgress?: (pct: number) => void): Observable<void> {
    return new Observable((observer) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          observer.next();
          observer.complete();
        } else {
          observer.error(new Error('S3 upload failed'));
        }
      };

      xhr.onerror = () => observer.error(new Error('S3 upload failed'));
      xhr.send(file);
    });
  }

  confirm(assetId: string): Observable<MediaAsset> {
    return this.http.post<MediaAsset>(`${this.apiUrl}/${assetId}/confirm/`, {});
  }

  /** Full flow: presign -> upload -> confirm */
  uploadFile(file: File, folder: 'brands' | 'products', onProgress?: (pct: number) => void): Observable<MediaAsset> {
    return this.presign(file.name, file.type, folder).pipe(
      switchMap((presigned) =>
        this.uploadToS3(presigned.upload_url, file, onProgress).pipe(
          switchMap(() => this.confirm(presigned.id))
        )
      )
    );
  }

  delete(assetId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${assetId}/`);
  }
}