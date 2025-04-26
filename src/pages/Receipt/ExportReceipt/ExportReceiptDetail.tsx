import axios from "axios";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { FormEvent, useEffect, useRef, useState } from "react";
import Label from "../../components/form/Label";
import { toast } from "react-toastify";
import Switch from "../../components/form/switch/Switch";
import TextEditor from "../../components/ckeditor/TextEditor";
import { ExportReceipts } from "../../../types/index";
interface Props {
  exportReceipt: ExportReceipts;
  setClose: () => void;
  refresh: () => void;
}

export const EditProduct = ({ exportReceipt, setClose, refresh }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    id: 0,
    name: "",
    description: "",
    detail: "",
    price: 0,
    stock_quantity: 0,
    isDiscount: false,
    hot: false,
    brand_id: 0,
    product_line_id: 0,
    images: [] as { image_url: string; isThumbnail: boolean }[],
  });
  useEffect(() => {
    if (product) {
      setForm({
        id: product.id || 0,
        name: product.name || "",
        description: product.description || "",
        detail: product.detail || "",
        price: product.price || 0,
        stock_quantity: product.stock_quantity || 0,
        isDiscount: product.isDiscount,
        hot: product.hot,
        brand_id: product.brand_id || null,
        product_line_id: product.product_line_id || null,
        images:
          product.images?.map(({ image_url, isThumbnail }) => ({
            image_url,
            isThumbnail,
          })) || [],
      });
    }
  }, [product]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (form.images.length >= 5) {
        toast.warning("Chỉ được phép tải lên tối đa 5 ảnh.");
        return;
      }

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
          const hasThumbnail = form.images.some((img) => img.isThumbnail);
          setForm((prev) => ({
            ...prev,
            images: [
              ...prev.images,
              {
                image_url: imagePath,
                isThumbnail: !hasThumbnail,
              },
            ],
          }));
        }
      } catch (error) {
        console.error("Upload image failed:", error);
        toast.error("Tải ảnh thất bại.");
      }
    } else {
      console.error("No file selected.");
    }
  };


  const handleProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/products/${product.id}`, form);
      toast.success(res.data.message);
      refresh();
      setClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error?.response?.data?.message || "An error occurred. Please try again.";
        toast.error(errorMessage);
        console.error("Error fetching data:", error);
      } else {
        toast.error("An unknown error occurred.");
        console.error("Unexpected error:", error);
      }
    }
  };
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-6xl shadow-lg relative border border-gray-200 dark:border-white/[0.1] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Sửa sản phẩm</h2>
        <form onSubmit={handleProduct}>
          <div className="mb-4">
            <Label htmlFor="code">Tên sản phẩm</Label>
            <Input id="name" type="text" placeholder="Tên sản phẩm" name="name" value={form.name} required />
          </div>
          <div className="flex gap-5 mb-4">
            <div className="w-1/2 max-w-1/2">
              <Label htmlFor="price">Giá sản phẩm</Label>
              <Input id="price" type="number" placeholder="Giá sản phẩm" name="price" value={form.price} onChange={onChange} required />
            </div>
            <div className="w-1/2 max-w-1/2">
              <Label htmlFor="stock_quanlity">Số lượng</Label>
              <Input id="stock_quantity" type="number" placeholder="Số lượng" name="stock_quantity" value={form.stock_quantity} onChange={onChange} required />
            </div>
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
