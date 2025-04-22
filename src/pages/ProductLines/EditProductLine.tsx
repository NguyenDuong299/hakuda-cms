import axios from "axios";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useEffect, useRef, useState } from "react";
import Label from "../../components/form/Label";
import { toast } from "react-toastify";
import { ProductLines } from "../../types";

interface Props {
  productLine: ProductLines;
  setClose: () => void;
  refresh: () => void;
}

export const EditProductLine = ({ productLine, setClose, refresh }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (productLine) {
      setForm({
        id: productLine.id,
        name: productLine.name,
        description: productLine.description,
        image: productLine.image,
      });
    }
  }, [productLine]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductLine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/product-lines/${form.id}`, form);
      toast.success(res.data.message);
      refresh();
      setClose();
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.response.data.message);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
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
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-2xl shadow-lg relative border border-gray-200 dark:border-white/[0.1] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Chỉnh sửa dòng sản phẩm</h2>
        <form onSubmit={handleProductLine}>
          <div className="mb-4">
            <Label htmlFor="name">Tên dòng sản phẩm</Label>
            <Input id="name" type="text" placeholder="Tên dòng sản phẩm" name="name" value={form.name} onChange={onChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="description">Mô tả dòng sản phẩm</Label>
            <Input id="description" type="text" placeholder="Mô tả dòng sản phẩm" name="description" value={form.description} onChange={onChange} />
          </div>
          <div className="mb-4">
            <Label htmlFor="thumbnail">Ảnh dòng sản phẩm</Label>
            <Button type="button" onClick={triggerFileSelect}>
              Chọn ảnh
            </Button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
            {form.image && <img src={`${API_URL}/${form.image}`} alt="Preview" className="max-w-full max-h-64 rounded-lg border mt-2" />}
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
