/**
 * Cloudinary & Image Processing Utilities for MuttaMeter
 */

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  bytes: number;
}

interface CloudinarySignatureResponse {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
}

/**
 * Validates if a file is a supported image type and under size limit
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, or WebP images are allowed." };
  }
  
  const maxSize = 8 * 1024 * 1024; // 8MB
  if (file.size > maxSize) {
    return { valid: false, error: "File too large. Max 8MB evidence allowed." };
  }

  return { valid: true };
}

/**
 * Resizes and compresses an image in the browser using Canvas
 */
export async function compressImageClient(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const max_size = 1200;

        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const finishAsJpeg = () => {
          canvas.toBlob(
            (jpegBlob) => {
              if (jpegBlob) resolve(jpegBlob);
              else reject(new Error("Compression failed"));
            },
            "image/jpeg",
            0.75
          );
        };

        canvas.toBlob(
          (webpBlob) => {
            if (webpBlob) resolve(webpBlob);
            else finishAsJpeg();
          },
          "image/webp",
          0.75
        );
      };
      img.onerror = () => reject(new Error("Image loading failed"));
    };
    reader.onerror = () => reject(new Error("File reading failed"));
  });
}

/**
 * Uploads a file/blob to Cloudinary using a short-lived server signature.
 */
export async function uploadToCloudinary(
  file: File | Blob, 
  onProgress?: (progress: number) => void,
  kind: "proof" | "avatar" = "proof"
): Promise<CloudinaryUploadResult> {
  const signatureResponse = await fetch("/api/cloudinary/signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind }),
  });

  if (!signatureResponse.ok) {
    const result = await signatureResponse.json().catch(() => null);
    throw new Error(result?.error || "Cloudinary upload authorization failed.");
  }

  const { cloudName, apiKey, folder, timestamp, signature } =
    (await signatureResponse.json()) as CloudinarySignatureResponse;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('folder', folder);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);

  const xhr = new XMLHttpRequest();
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  return new Promise((resolve, reject) => {
    xhr.open('POST', url, true);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
