import { Component, EventEmitter, inject, Input, OnDestroy, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService, MediaAsset } from '@shared/services/media/media.service';
import { UploadItem } from '@shared/models/upload-item.model';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-uploader.html',
  styleUrls: ['./image-uploader.scss'],
})
export class ImageUploader implements OnDestroy {
  private readonly mediaService = inject(MediaService);

  @Input() multiple = false;
  @Input() folder: 'brands' | 'products' = 'products';
  @Input() maxFiles = 10;
  @Input() maxSizeMb = 5;
  @Input() disabled = false;
  @Input() accept = 'image/jpeg,image/png,image/webp';
  @Input() mode: 'create' | 'edit' | 'view' = 'create';

  /** Preload existing attached assets (edit mode) */
  @Input() set initialAssets(assets: MediaAsset[] | null) {
    if (!assets?.length) return;
    const items: UploadItem[] = assets.map((a, i) => ({
      localId: a.id,
      file: null,
      previewUrl: a.url ?? '',
      progress: 100,
      status: 'uploaded',
      assetId: a.id,
      serverUrl: a.url ?? undefined,
      isPrimary: a.isPrimary,
    }));
    this.items.set(items);
  }

  /** Emits the list of confirmed asset IDs whenever it changes — parent form binds to this */
  @Output() assetIdsChange = new EventEmitter<string[]>();
  @Output() primaryAssetIdChange = new EventEmitter<string | null>();

  @Output() imagesChange = new EventEmitter<{ mediaAssetId: string; isPrimary: boolean }[]>();


  readonly items = signal<UploadItem[]>([]);
  readonly isDragging = signal(false);

  get uploadedCount(): number {
    return this.items().filter((i) => i.status === 'uploaded').length;
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    if (this.disabled) return;
    this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragging.set(false);
    if (this.disabled || !e.dataTransfer?.files) return;
    this.handleFiles(Array.from(e.dataTransfer.files));
  }

  onFileInputChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;
    this.handleFiles(Array.from(input.files));
    input.value = '';   // allow re-selecting the same file later
  }

  private handleFiles(files: File[]): void {
    if (this.disabled) return;

    if (!this.multiple) {
      files = files.slice(0, 1);
      // replace existing single item
      this.revokeAllPreviews();
      this.items.set([]);
    } else {
      const remaining = this.maxFiles - this.items().length;
      if (remaining <= 0) return;
      files = files.slice(0, remaining);
    }

    for (const file of files) {
      const error = this.validateFile(file);
      const localId = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(file);

      const item: UploadItem = {
        localId,
        file,
        previewUrl,
        progress: 0,
        status: error ? 'failed' : 'pending',
        error: error ?? undefined,
        isPrimary: this.items().length === 0,
      };

      this.items.update((list) => [...list, item]);

      if (!error) {
        this.startUpload(localId, file);
      }
    }
  }

  private validateFile(file: File): string | null {
    const allowedTypes = this.accept.split(',');
    if (!allowedTypes.includes(file.type)) {
      return 'Unsupported file type';
    }
    if (file.size > this.maxSizeMb * 1024 * 1024) {
      return `File exceeds ${this.maxSizeMb}MB limit`;
    }
    return null;
  }

  private startUpload(localId: string, file: File): void {
    this.updateItem(localId, { status: 'uploading' });

    this.mediaService
      .uploadFile(file, this.folder, (pct) => this.updateItem(localId, { progress: pct }))
      .subscribe({
        next: (asset) => {
          this.updateItem(localId, {
            status: 'uploaded',
            progress: 100,
            assetId: asset.id,
            serverUrl: asset.url ?? undefined,
          });
          this.emitChanges();
        },
        error: (err) => {
          this.updateItem(localId, { status: 'failed', error: err?.message ?? 'Upload failed' });
        },
      });
  }

  retry(localId: string): void {
    const item = this.items().find((i) => i.localId === localId);
    if (!item?.file) return;
    this.updateItem(localId, { status: 'pending', error: undefined, progress: 0 });
    this.startUpload(localId, item.file);
  }

  remove(localId: string): void {
    const item = this.items().find((i) => i.localId === localId);
    if (item?.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(item.previewUrl);
    }

    const wasPrimary = item?.isPrimary;

    this.items.update((list) => list.filter((i) => i.localId !== localId));

    // if we removed the primary image, promote the next one
    if (wasPrimary && this.items().length > 0) {
      this.setPrimary(this.items()[0].localId);
    }

    // best-effort server cleanup if it was already confirmed
    if (item?.assetId) {
      this.mediaService.delete(item.assetId).subscribe({ error: () => { } });
    }

    this.emitChanges();
  }

  setPrimary(localId: string): void {
    if (!this.multiple) return;
    this.items.update((list) =>
      list.map((i) => ({ ...i, isPrimary: i.localId === localId }))
    );
    const item = this.items().find((i) => i.localId === localId);
    this.primaryAssetIdChange.emit(item?.assetId ?? null);
    this.emitChanges();
  }

  moveUp(index: number): void {
    if (index === 0) return;
    this.reorder(index, index - 1);
  }

  moveDown(index: number): void {
    if (index === this.items().length - 1) return;
    this.reorder(index, index + 1);
  }

  private reorder(from: number, to: number): void {
    const items = [...this.items()];
    [items[from], items[to]] = [items[to], items[from]];
    this.items.set(items);
    this.emitChanges();
  }

  private updateItem(localId: string, patch: Partial<UploadItem>): void {
    this.items.update((list) =>
      list.map((i) => (i.localId === localId ? { ...i, ...patch } : i))
    );
  }

  private emitChanges(): void {
    const ids = this.items()
      .filter((i) => i.status === 'uploaded' && i.assetId)
      .map((i) => i.assetId!);
    this.assetIdsChange.emit(ids);

    const uploaded = this.items().filter((i) => i.status === 'uploaded' && i.assetId);
    const payload = uploaded.map((i) => ({ mediaAssetId: i.assetId!, isPrimary: !!i.isPrimary }));
    this.imagesChange.emit(payload);
  }

  private revokeAllPreviews(): void {
    this.items().forEach((i) => {
      if (i.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(i.previewUrl);
    });
  }

  ngOnDestroy(): void {
    this.revokeAllPreviews();
  }
}