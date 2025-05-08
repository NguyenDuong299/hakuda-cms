import axios from "axios";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import { toast } from "react-toastify";
import { Suppliers } from "../../types/index";

interface Props {
  supplier: Suppliers;
  setClose: () => void;
  refresh: () => void;
}

export const EditSupplier = ({ supplier, setClose, refresh }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    id: 0,
    name: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (supplier) {
      setForm({
        id: supplier.id,
        name: supplier.name,
        email: supplier.email,
        phoneNumber: supplier.phoneNumber,
      });
    }
  }, [supplier]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/suppliers/${form.id}`, form);
      toast.success(res.data.message);
      refresh();
      setClose();
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-2xl shadow-lg relative border border-gray-200 dark:border-white/[0.1] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Chỉnh sửa nhà cung cấp</h2>
        <form onSubmit={handleSupplier}>
          <div className="mb-4">
            <Label htmlFor="name">Tên nhà cung cấp <span className="text-red-500">*</span></Label>
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
