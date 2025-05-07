import axios from "axios";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { FormEvent, useEffect, useRef, useState } from "react";
import Label from "../../components/form/Label";
import { toast } from "react-toastify";
import Switch from "../../components/form/switch/Switch";
import TextEditor from "../../components/ckeditor/TextEditor";
import { Brands, ProductLines, Products } from "../../types/index";
interface Props {
  product: Products;
  setClose: () => void;
  refresh: () => void;
}

export const EditProduct = ({ product, setClose, refresh }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [brand, setBrand] = useState<Brands[]>([]);
  const [productLine, setProductLine] = useState<ProductLines[]>([]);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    description: "",
    detail: "",
    price: 0,
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
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock_quantity" ? Number(value) : value,
    }));
  };

  const handleHotChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, hot: checked }));
  };
  const handleDiscountChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, isDiscount: checked }));
  };
  const handleDetailChange = (data: string) => {
    setForm((prev) => ({ ...prev, detail: data }));
  };
  const handleDescriptionChange = (data: string) => {
    setForm((prev) => ({ ...prev, description: data }));
  };
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

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/products/${product.id}`, form);
      toast.success(res.data.message);
      refresh();
      setClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Có lỗi xảy ra");
      console.log(error);
    }
  };

  const fetchBrand = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/brands`);
      setBrand(res.data.brands);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchProductLine = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/product-lines`);
      setProductLine(res.data.productLines);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchBrand();
    fetchProductLine();
  }, []);

  const handleThumbnailChange = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((image, i) => (i === index ? { ...image, isThumbnail: true } : { ...image, isThumbnail: false })),
    }));
  };
  const handleImageDelete = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  console.log(form.hot);
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-6xl shadow-lg relative border border-gray-200 dark:border-white/[0.1] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Sửa sản phẩm</h2>
        <form onSubmit={handleProduct}>
          <div className="flex gap-5 mb-4">
            <div className="w-1/2 max-w-1/2">
              <Label htmlFor="code">Tên sản phẩm</Label>
              <Input id="name" type="text" placeholder="Tên sản phẩm" name="name" value={form.name} onChange={onChange} required />
            </div>
            <div className="w-1/2 max-w-1/2">
              <Label htmlFor="price">Giá sản phẩm</Label>
              <Input id="price" type="number" placeholder="Giá sản phẩm" name="price" value={form.price} onChange={onChange} required />
            </div>
          </div>
          <div className="flex gap-5 mb-4">
            <div className="w-1/2 max-w-1/2">
              <Switch label="Nổi bật sản phẩm" checked={Boolean(form.hot)} onChange={handleHotChange} />
            </div>
            <div className="w-1/2 max-w-1/2">
              <Switch label="Sản phẩm khuyến mãi" checked={Boolean(form.isDiscount)} onChange={handleDiscountChange} />
            </div>
          </div>
          <div className="flex gap-5 mb-4">
            <div className="w-1/2 max-w-1/2">
              <Label htmlFor="brand_id">Thương hiệu</Label>
              <select id="brand_id" name="brand_id" value={form.brand_id} onChange={onChange} className="w-full p-2 border rounded text-[14px]">
                <option value="">-- Chọn thương hiệu --</option>
                {brand.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2 max-w-1/2">
              <Label htmlFor="product_line_id">Dòng sản phẩm</Label>
              <select id="product_line_id" name="product_line_id" value={form.product_line_id} onChange={onChange} className="w-full p-2 border rounded text-[14px]">
                <option value="">-- Chọn dòng sản phẩm --</option>
                {productLine.map((productLine) => (
                  <option key={productLine.id} value={productLine.id}>
                    {productLine.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="thumbnail">Hình ảnh (Thumbnail)</Label>
            <Button type="button" onClick={triggerFileSelect}>
              Chọn ảnh
            </Button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={`${API_URL}/${image.image_url}`} alt={`Ảnh ${index + 1}`} className={`w-40 h-40 object-cover rounded border ${image.isThumbnail ? "ring-2 ring-blue-500" : ""}`} />
                  {image.isThumbnail && <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">Thumbnail</span>}
                  <div className="absolute top-0 right-0 p-1 bg-white rounded-full cursor-pointer" onClick={() => handleImageDelete(index)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  {!image.isThumbnail && (
                    <button className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-1 rounded text-nowrap" onClick={() => handleThumbnailChange(index)}>
                      Đặt làm thumbnail
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="detail">Chi tiết sản phẩm</Label>
            <TextEditor value={form.detail} onChange={handleDetailChange} />
          </div>
          <div className="mt-4">
            <Label htmlFor="description">Mô tả sản phẩm</Label>
            <TextEditor value={form.description} onChange={handleDescriptionChange} />
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
