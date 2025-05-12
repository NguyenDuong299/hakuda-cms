import axios from "axios";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { FormEvent, useEffect, useState } from "react";
import Label from "../../../components/form/Label";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import CustomSelect from "../../../components/common/CustomSelect";

interface Props {
  setClose: () => void;
  refresh: () => void;
}

export const AddImportReceipt = ({ setClose, refresh }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);

  const [form, setForm] = useState({
    supplier_id: "",
    import_date: new Date().toISOString().split("T")[0],
    total_amount: 0,
    note: "",
    import_receipt_details: [] as { quantity: number; import_price: number; product_id: number }[],
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "total_amount" ? Number(value) : value,
    }));
  };

  useEffect(() => {
    const total = form.import_receipt_details.reduce((sum, item) => sum + item.quantity * item.import_price, 0);
    setForm((prev) => ({
      ...prev,
      total_amount: total,
    }));
  }, [form.import_receipt_details]);

  const handleDetailChange = (index: number, field: keyof (typeof form.import_receipt_details)[0], value: string) => {
    const newDetails = [...form.import_receipt_details];
    newDetails[index] = {
      ...newDetails[index],
      [field]: field === "product_id" ? Number(value) : Number(value),
    };
    setForm((prev) => ({
      ...prev,
      import_receipt_details: newDetails,
    }));
  };

  const addDetailRow = () => {
    setForm((prev) => ({
      ...prev,
      import_receipt_details: [...prev.import_receipt_details, { product_id: 0, quantity: 0, import_price: 0 }],
    }));
  };

  const removeDetailRow = (index: number) => {
    const newDetails = form.import_receipt_details.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      import_receipt_details: newDetails,
    }));
  };

  const handleImportReceipt = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.supplier_id || !form.import_date || !form.total_amount || form.import_receipt_details.length === 0) {
      toast.error("Vui lòng nhập đầy đủ thông tin và ít nhất một sản phẩm chi tiết.");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/import-receipts`, form);
      toast.success("Tạo phiếu nhập thành công!");
      refresh();
      setClose();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/suppliers`);
        setSuppliers(res.data.suppliers);
      } catch (error) {
        console.error("Error fetching suppliers", error);
      }
    };
    fetchSuppliers();
  }, []);
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/filter/all`);
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching suppliers", error);
      }
    };
    fetchSuppliers();
  }, []);
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-3xl shadow-lg relative border border-gray-200 dark:border-white/[0.1] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Tạo phiếu nhập kho</h2>
        <form onSubmit={handleImportReceipt}>
          <div className="mb-4">
            <Label htmlFor="supplier_id">Chọn nhà cung cấp</Label>
            <select
              id="supplier_id"
              name="supplier_id"
              value={form.supplier_id}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  supplier_id: e.target.value,
                }));
              }}
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
            >
              <option value="" disabled>
                Chọn nhà cung cấp
              </option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <Label htmlFor="import_date">Ngày nhập</Label>
            <Input type="text" placeholder="Ngày nhập" name="import_date" value={format(new Date(form.import_date), "dd/MM/yyyy")} className="cursor-not-allowed" />
          </div>

          <div className="mb-4">
            <Label htmlFor="total_amount">Tổng tiền</Label>
            <Input id="total_amount" type="number" name="total_amount" value={form.total_amount} required className="cursor-not-allowed" />
          </div>

          <div className="mb-4">
            <Label htmlFor="note">Ghi chú</Label>
            <textarea
              id="note"
              name="note"
              rows={3}
              value={form.note}
              onChange={onChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-white/[0.2]"
              placeholder="Ghi chú (nếu có)"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center">
              <Label>Chi tiết nhập hàng</Label>
              <Button type="button" onClick={addDetailRow} className="gap-1 text-sm">
                <Plus size={16} />
                Thêm sản phẩm
              </Button>
            </div>

            {form.import_receipt_details.length === 0 && <p className="text-gray-500 mt-2 text-sm">Chưa có sản phẩm.</p>}

            {form.import_receipt_details.map((item, index) => (
              <div key={index} className="flex flex-col gap-2 mt-3">
                <div className="w-full">
                  <Label>Sản phẩm</Label>
                  <CustomSelect options={products} value={item.product_id} onChange={(val) => handleDetailChange(index, "product_id", val)} placeholder="Chọn sản phẩm" />
                </div>
                <div className="w-full">
                  <Label>Số lượng</Label>
                  <Input type="number" placeholder="Số lượng" value={item.quantity} onChange={(e) => handleDetailChange(index, "quantity", e.target.value)} min={1} required />
                </div>
                <div className="w-full">
                  <Label>Giá nhập</Label>
                  <Input type="number" placeholder="Giá nhập" value={item.import_price} onChange={(e) => handleDetailChange(index, "import_price", e.target.value)} min={0} required />
                </div>
                <div className="col-span-2 text-right">
                  <Button type="button" variant="ghost" onClick={() => removeDetailRow(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-6">
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
