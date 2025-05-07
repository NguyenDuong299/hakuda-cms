import axios from "axios";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { FormEvent, useRef, useState } from "react";
import Label from "../../components/form/Label";
import { toast } from "react-toastify";
interface Props {
  setClose: () => void;
  refresh: () => void;
}

export const AddSupplier = ({ setClose, refresh }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSupplier = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/suppliers`, form);
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
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-2xl shadow-lg relative border border-gray-200 dark:border-white/[0.1] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Thêm nhà cung cấp</h2>
        <form onSubmit={handleSupplier}>
          <div className="mb-4">
            <Label htmlFor="name">Tên nhà cung cấp</Label>
            <Input id="name" type="text" placeholder="Tên nhà cung cấp" name="name" value={form.name} onChange={onChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Email" name="email" value={form.email} onChange={onChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input id="phoneNumber" type="tel" placeholder="Tên nhà cung cấp" name="phoneNumber" value={form.phoneNumber} onChange={onChange} required />
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
