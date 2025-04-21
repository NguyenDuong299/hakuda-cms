import { useEffect, useState } from "react";

interface ImageUploaderProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);

      // Cleanup URL khi unmount hoặc file thay đổi
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange?.(file);
  };

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
