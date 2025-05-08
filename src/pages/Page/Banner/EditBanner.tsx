import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import { Banners } from "../../../types";
interface Props {
  banner: Banners;
  setClose: () => void;
  refresh: () => void;
}
export const EditBanner = ({ banner, setClose, refresh }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    id: 0,
    name: "",
    image: "",
    description: "",
  });

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (banner) {
      setForm({
        id: banner.id,
        name: banner.name,
        image: banner.image,
        description: banner.description,
      });
    }
  }, [banner]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imagePath = response.data?.path;
        if (imagePath) {
          setForm((prev) => {
            const updatedForm = { ...prev, image: imagePath };
            return updatedForm;
          });
        }
      } catch (error) {
        console.error("Upload image failed:", error);
      }
    } else {
      console.error("No file selected.");
    }
  };

  const handlePut = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/banners/${form.id}`, form);
      refresh();
      toast.success(res.data.message);
      setClose();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-2xl shadow-lg relative border border-gray-200 dark:border-white/[0.1] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Chỉnh sửa bài viết</h2>
        <form onSubmit={handlePut}>
          <div className="mb-4">
            <Label htmlFor="name">Tên Banner <span className="text-red-500">*</span></Label>
            <Input id="name" type="text" placeholder="Tên Banner" name="name" value={form.name} onChange={onChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="thumbnail">Hình ảnh <span className="text-red-500">*</span></Label>
            <Button type="button" onClick={triggerFileSelect}>
              Chọn ảnh
            </Button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
            {form.image && <img src={`${API_URL}/${form.image}`} alt="Preview" className="max-w-full max-h-64 rounded-lg border mt-2" />}
          </div>
          <div className="mb-4">
            <Label htmlFor="description">Mô tả</Label>
            <Input id="description" type="text" placeholder="Mô tả" name="description" value={form.description} onChange={onChange} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={setClose}>
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
