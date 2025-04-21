// components/form/form-elements/DropZone.tsx

import React, { useEffect, useState } from "react";

interface ImageUploaderProps {
  initialPreviewUrl?: string;
  onFileSelect?: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ initialPreviewUrl, onFileSelect }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreviewUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect?.(file);
    }
  };

  useEffect(() => {
    if (initialPreviewUrl) {
      setPreviewUrl(initialPreviewUrl);
    }
  }, [initialPreviewUrl]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-xl max-w-md mx-auto">
      <input type="file" accept="image/*" id="imageInput" onChange={handleFileChange} className="hidden" />
      <label htmlFor="imageInput" className="cursor-pointer py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm font-semibold">
        {previewUrl ? "Chọn ảnh khác" : "Chọn ảnh"}
      </label>
      {previewUrl && <img src={previewUrl} alt="Preview" className="max-w-full max-h-64 rounded-lg border" />}
    </div>
  );
};

export default ImageUploader;
