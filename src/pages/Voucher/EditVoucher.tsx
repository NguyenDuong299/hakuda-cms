import axios from "axios";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import { toast } from "react-toastify";
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from "sub-vn";
import { Vouchers } from "../../types";
import DatePicker from "../../components/form/date-picker";
import { Hook } from "flatpickr/dist/types/options";

interface Props {
  voucher: Vouchers;
  setClose: () => void;
  refresh: () => void;
}

export const EditVoucher = ({ voucher, setClose, refresh }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    id: "",
    code: "",
    discountType: "",
    discountValue: 0,
    quantity: 0,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (voucher) {
      setForm({
        id: voucher.id,
        code: voucher.code,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        quantity: voucher.quantity,
        startDate: toYMD(new Date(voucher.startDate)),
        endDate: toYMD(new Date(voucher.endDate)),
      });
    }
  }, [voucher]);

  const toYMD = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
    const seconds = `${date.getSeconds()}`.padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const onChangeStartDate: Hook = (dates) => {
    const selectedDate = dates[0];
    if (selectedDate) {
      setForm((prev) => ({ ...prev, startDate: toYMD(selectedDate) }));
    }
  };

  const onChangeEndDate: Hook = (dates) => {
    const selectedDate = dates[0];
    if (selectedDate) {
      setForm((prev) => ({ ...prev, endDate: toYMD(selectedDate) }));
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/vouchers/${form.id}`, form);
      toast.success(res.data.message);
      refresh();
      setClose();
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-2xl shadow-lg relative border border-gray-200 dark:border-white/[0.1] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Chỉnh sửa Voucher</h2>
        <form onSubmit={handleUser}>
          <div className="mb-4">
            <Label htmlFor="code">Code</Label>
            <Input id="code" type="text" placeholder="Code" name="code" value={form.code} onChange={onChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="discountType">Loại mã</Label>
            <select id="discountType" name="discountType" value={form.discountType} onChange={onChange} required className="w-full p-2 border rounded text-[14px]">
              <option value="" disabled>
                -- Chọn loại giảm giá --
              </option>
              <option value="percentage">Percentage Code</option>
              <option value="amount">Amount Code</option>
            </select>
          </div>
          <div className="mb-4">
            <Label htmlFor="discountValue">Giá giảm</Label>
            <Input id="discountValue" type="number" placeholder="Giá giảm" name="discountValue" value={form.discountValue} onChange={onChange} />
          </div>
          <div className="mb-4">
            <Label htmlFor="quantity">Số lượng</Label>
            <Input id="quantity" type="number" placeholder="Số lượng" name="quantity" value={form.quantity} onChange={onChange} />
          </div>
          <div className="mb-4">
            <Label htmlFor="startDate">Ngày bắt đầu</Label>
            <DatePicker id="startDate" defaultDate={form.startDate ? new Date(form.startDate) : undefined} placeholder="Chọn ngày bắt đầu" onChange={onChangeStartDate} />
          </div>
          <div className="mb-4">
            <Label htmlFor="endDate">Ngày kết thúc</Label>
            <DatePicker id="endDate" defaultDate={form.endDate ? new Date(form.endDate) : undefined} placeholder="Chọn ngày kết thúc" onChange={onChangeEndDate} />
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
