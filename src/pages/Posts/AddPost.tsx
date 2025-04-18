import axios from "axios";
import Input from "../../components/form/input/InputField";
import Switch from "../../components/form/switch/Switch";
import Button from "../../components/ui/button/Button";
import TextEditor from "../../components/ckeditor/TextEditor";
import { useState } from "react";
import { Posts } from "../../types/index";
import Label from "../../components/form/Label";
import UploadImage from "../../components/form/form-elements/DropZone";

interface Props {
  setClose: () => void;
}

export const AddPost = ({ setClose }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState<Posts>({
    title: "",
    author: "",
    thumbnail: "", // Sử dụng một chuỗi trống để đại diện cho ảnh chưa chọn
    content: "",
    hot: false,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleHotChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, hot: checked }));
  };

  const handleEditorChange = (data: string) => {
    setForm((prev) => ({ ...prev, content: data }));
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/posts`, form);
      console.log(res.data);
      setClose(); // Đóng modal sau khi gửi thành công
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const onChangeImage = (path: string) => {
    setForm((prev) => ({ ...prev, thumbnail: path }));
  };
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-2xl shadow-lg relative border border-gray-200 dark:border-white/[0.1] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Tạo bài viết</h2>
        <form onSubmit={handlePost}>
          <div className="mb-4">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input id="title" type="text" placeholder="Tiêu đề" name="title" value={form.title} onChange={onChange} />
          </div>
          <div className="mb-4">
            <Label htmlFor="author">Tác giả</Label>
            <Input id="author" type="text" placeholder="Tác giả" name="author" value={form.author} onChange={onChange} />
          </div>
          <div className="mb-4">
            <Label htmlFor="thumbnail">Hình ảnh (URL)</Label>
            <UploadImage id="thumbnail" type="text" placeholder="Hình ảnh (URL)" name="thumbnail" value={form.thumbnail} onChange={onChangeImage} />
          </div>
          <div className="mb-4">
            <Switch label="Nổi bật bài viết" checked={form.hot} onChange={handleHotChange} />
          </div>
          <div className="mt-4">
            <Label htmlFor="content">Nội dung</Label>
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
