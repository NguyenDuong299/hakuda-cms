import axios from "axios";
import Input from "../../components/form/input/InputField";
import Switch from "../../components/form/switch/Switch";
import Button from "../../components/ui/button/Button";
import TextEditor from "../../components/ckeditor/TextEditor";
import { useRef, useState } from "react";
import Label from "../../components/form/Label";
import { toast } from "react-toastify";

interface Props {
  setClose: () => void;
  refresh: () => void;
}

export const AddPost = ({ setClose, refresh }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    title: "",
    author: "",
    thumbnail: "",
    content: "",
    hot: false,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHotChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, hot: checked }));
  };

  const handleEditorChange = (data: string) => {
    setForm((prev) => ({ ...prev, content: data }));
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
            const updatedForm = { ...prev, thumbnail: imagePath };
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

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/posts`, form);
      toast.success(res.data.message);
      refresh();
      setClose();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-2xl shadow-lg relative border border-gray-200 dark:border-white/[0.1] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Chỉnh sửa bài viết</h2>
        <form onSubmit={handlePost}>
          <div className="mb-4">
            <Label htmlFor="title">Tiêu đề <span className="text-red-500">*</span></Label>
            <Input id="title" type="text" placeholder="Tiêu đề" name="title" value={form.title} onChange={onChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="author">Tác giả <span className="text-red-500">*</span></Label>
            <Input id="author" type="text" placeholder="Tác giả" name="author" value={form.author} onChange={onChange} />
          </div>
          <div className="mb-4">
            <Switch label="Nổi bật bài viết" checked={form.hot} onChange={handleHotChange} />
          </div>
          <div className="mb-4">
            <Label htmlFor="thumbnail">Hình ảnh (Thumbnail) <span className="text-red-500">*</span></Label>
            <Button type="button" onClick={triggerFileSelect}>
              Chọn ảnh
            </Button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
            {form.thumbnail && <img src={`${API_URL}/${form.thumbnail}`} alt="Preview" className="max-w-full max-h-64 rounded-lg border mt-2" />}
          </div>
          <div className="mt-4">
            <Label htmlFor="content">Nội dung <span className="text-red-500">*</span></Label>
            <TextEditor value={form.content} onChange={handleEditorChange} />
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
