"use client";

import { useState, useRef, useEffect } from "react";
import { 
  validateImageFile, 
  compressImageClient, 
  uploadToCloudinary, 
  formatFileSize,
  CloudinaryUploadResult 
} from "@/lib/cloudinary";
import { Camera, X, Check, Loader2, Info } from "lucide-react";
import gsap from "gsap";

interface PuffPhotoUploaderProps {
  onUploadComplete: (result: CloudinaryUploadResult | null) => void;
  label?: string;
}

export function PuffPhotoUploader({ onUploadComplete, label = "ADD PUFF PROOF" }: PuffPhotoUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewUrl && previewRef.current) {
      gsap.from(previewRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
      });
    }
  }, [previewUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Compress
      const compressed = await compressImageClient(file);
      setCompressedBlob(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));

      // 2. Upload to Cloudinary
      const result = await uploadToCloudinary(compressed, (p) => setUploadProgress(p));
      
      setIsDone(true);
      onUploadComplete(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed. Sector blocked.";
      setError(message);
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setCompressedBlob(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setIsDone(false);
    setError(null);
    onUploadComplete(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="font-comic font-black text-sm uppercase tracking-tight flex items-center gap-2">
          <Camera size={16} /> {label}
        </label>
        {selectedFile && (
          <button 
            type="button"
            onClick={clearSelection}
            className="text-[10px] font-black underline opacity-50 hover:opacity-100"
          >
            REMOVE EVIDENCE
          </button>
        )}
      </div>

      {!previewUrl ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-video border-3 border-dashed border-chocolate-brown/20 rounded-brutalist bg-bakery-paper flex flex-col items-center justify-center gap-4 hover:border-warm-orange hover:bg-white transition-all group"
        >
          <div className="w-16 h-16 bg-white border-3 border-chocolate-brown rounded-full flex items-center justify-center shadow-brutalist-sm group-hover:-rotate-6 transition-transform">
            <Camera size={32} />
          </div>
          <div className="text-center px-4">
            <p className="font-black text-sm">UPLOAD PUFF INTERIOR</p>
            <p className="text-[10px] font-bold opacity-50 italic">Mandatory for Scam Level Reports</p>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </button>
      ) : (
        <div 
          ref={previewRef}
          className="relative brutalist-card bg-white p-2 overflow-hidden aspect-video flex items-center justify-center group"
        >
          <img 
            src={previewUrl} 
            alt="Puff Proof Preview" 
            className="w-full h-full object-cover rounded-lg"
          />
          
          {/* Overlay Status */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all ${
            isUploading ? "bg-chocolate-brown/60 backdrop-blur-sm" : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:bg-chocolate-brown/20"
          }`}>
            {isUploading && (
              <>
                <Loader2 className="text-egg-yellow animate-spin mb-4" size={48} />
                <div className="w-3/4 h-4 bg-white/20 border-2 border-white rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-egg-yellow transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-white font-black text-xs mt-2 uppercase tracking-widest">
                  ANALYZING EGG... {uploadProgress}%
                </p>
              </>
            )}
            
            {isDone && !isUploading && (
              <div className="bg-green-500 text-white p-3 rounded-full border-2 border-white shadow-lg animate-bounce">
                <Check size={32} strokeWidth={4} />
              </div>
            )}
          </div>

          {/* Compression Info Badge */}
          {selectedFile && compressedBlob && (
            <div className="absolute bottom-4 left-4 bg-white border-2 border-chocolate-brown rounded-full px-3 py-1 flex items-center gap-2 shadow-brutalist-sm scale-90 md:scale-100">
              <Info size={12} />
              <span className="text-[10px] font-black uppercase whitespace-nowrap">
                OPTIMIZED: {formatFileSize(selectedFile.size)} to {formatFileSize(compressedBlob.size)}
              </span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 bg-tomato-red text-white border-2 border-chocolate-brown rounded-lg font-black text-xs uppercase flex items-center gap-2">
          <X size={14} strokeWidth={3} /> {error}
        </div>
      )}
    </div>
  );
}
