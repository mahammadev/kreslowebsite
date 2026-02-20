import imageCompression from 'browser-image-compression';

export async function compressForUpload(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 0.2,        // 200KB max
    maxWidthOrHeight: 1200, // Enough for full-width product images on retina
    useWebWorker: true,
    fileType: 'image/webp', // WebP = best quality/size ratio
  });
}
