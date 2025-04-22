import axios from "axios";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import { toast } from "react-toastify";
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from "sub-vn";
import { Users } from "../../types";
interface Props {
  user: Users;
  setClose: () => void;
  refresh: () => void;
}

export const EditUser = ({ user, setClose, refresh }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const districts = selectedProvince ? getDistrictsByProvinceCode(selectedProvince) : [];
  const wards = selectedDistrict ? getWardsByDistrictCode(selectedDistrict) : [];
  const provinces = getProvinces();
  const [form, setForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    addressDesc: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        addressDesc: user.addressDesc || "",
      });
      setSelectedProvince(user.addressProvinceCode || "");
      setSelectedDistrict(user.addressDistrictCode || "");
      setSelectedWard(user.addressWardCode || "");
    }
  }, [user]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUser = async (e: React.FormEvent) => {
    const updatedForm = {
      ...form,
      addressProvinceCode: selectedProvince,
      addressDistrictCode: selectedDistrict,
      addressWardCode: selectedWard,
    };
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/users/${form.id}`, updatedForm);
      toast.success(res.data.message);
      refresh();
      setClose();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-2xl shadow-lg relative border border-gray-200 dark:border-white/[0.1] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Chỉnh sửa người dùng</h2>
        <form onSubmit={handleUser}>
          <div className="mb-4">
            <Label htmlFor="firstName">Tên</Label>
            <Input id="firstName" type="text" placeholder="Tên" name="firstName" value={form.firstName} onChange={onChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="lastName">Họ</Label>
            <Input id="lastName" type="text" placeholder="Họ" name="lastName" value={form.lastName} onChange={onChange} />
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="text" placeholder="Email" name="email" value={form.email} onChange={onChange} />
          </div>
          <div className="mb-4">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input id="phoneNumber" type="tel" placeholder="Số điện thoại" name="phoneNumber" value={form.phoneNumber} onChange={onChange} />
          </div>
          <div className="mb-4">
            <Label>Chọn tỉnh</Label>
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedDistrict("");
                setSelectedWard("");
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Chọn tỉnh</option>
              {provinces.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <Label>Chọn huyện</Label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedWard("");
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Chọn huyện</option>
              {districts.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <Label>Chọn xã</Label>
            <select
              value={selectedWard}
              onChange={(e) => {
                setSelectedWard(e.target.value);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Chọn xã</option>
              {wards.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <Label htmlFor="addressDetail">Địa chỉ</Label>
            <Input id="addressDetail" type="text" placeholder="Địa chỉ" name="address" value={form.addressDesc} onChange={onChange} />
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
