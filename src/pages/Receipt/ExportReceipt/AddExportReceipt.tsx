import axios from "axios";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { FormEvent, useEffect, useState } from "react";
import Label from "../../../components/form/Label";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Props {
  setClose: () => void;
  refresh: () => void;
}

export const AddExportReceipt = ({ setClose, refresh }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    export_date: new Date().toISOString().split("T")[0],
    total_amount: 0,
    user_id: 1,
    status: "pending",
    export_receipt_details: [] as { product_id: number; quantity: number; export_price: number }[],
  });



  const handleDetailChange = (index: number, field: keyof (typeof form.export_receipt_details)[0], value: string) => {
    const newDetails = [...form.export_receipt_details];
    newDetails[index] = {
      ...newDetails[index],
      [field]: field === "product_id" ? Number(value) : Number(value),
    };
    setForm((prev) => ({
      ...prev,
      export_receipt_details: newDetails,
    }));
  };

  useEffect(() => {
    const total = form.export_receipt_details.reduce((sum, item) => sum + item.quantity * item.export_price, 0);
    setForm((prev) => ({
      ...prev,
      total_amount: total,
    }));
  }, [form.export_receipt_details, handleDetailChange]);

  const addDetailRow = () => {
    setForm((prev) => ({
      ...prev,
      export_receipt_details: [...prev.export_receipt_details, { product_id: 0, quantity: 0, export_price: 0 }],
    }));
  };

  const removeDetailRow = (index: number) => {
    const newDetails = form.export_receipt_details.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      export_receipt_details: newDetails,
    }));
  };

  const handleImportReceipt = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.export_date || !form.total_amount || form.export_receipt_details.length === 0) {
      toast.error("Vui lòng nhập đầy đủ thông tin và ít nhất một sản phẩm chi tiết.");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/export-receipts`, form);
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
        const res = await axios.get(`${API_URL}/api/products`);
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
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Tạo phiếu xuất kho</h2>
        <form onSubmit={handleImportReceipt}>
          <div className="mb-4">
            <Label htmlFor="export_date">Ngày xuất</Label>
            <Input type="text" placeholder="Ngày xuất" name="export_date" value={format(new Date(form.export_date), "dd/MM/yyyy")} className="cursor-not-allowed" />
          </div>

          <div className="mb-4">
            <Label htmlFor="total_amount">Tổng tiền</Label>
            <Input id="total_amount" type="number" name="total_amount" value={form.total_amount} required min={0} readOnly className="cursor-not-allowed"/>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center">
              <Label>Chi tiết xuất hàng</Label>
              <Button type="button" onClick={addDetailRow} className="gap-1 text-sm">
                <Plus size={16} />
                Thêm sản phẩm
              </Button>
            </div>

            {form.export_receipt_details.length === 0 && <p className="text-gray-500 mt-2 text-sm">Chưa có sản phẩm.</p>}

            {form.export_receipt_details.map((item, index) => (
              <div key={index} className="flex flex-col gap-2 mt-3">
                <div className="w-full">
                  <Label>Mã sản phẩm</Label>
                  <select
                    value={item.product_id}
                    onChange={(e) => handleDetailChange(index, "product_id", e.target.value)}
                    className="w-full h-11 rounded-md border px-2 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Chọn mã sản phẩm</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <Label>Số lượng</Label>
                  <Input type="number" placeholder="Số lượng" value={item.quantity} onChange={(e) => handleDetailChange(index, "quantity", e.target.value)} min={1} required />
                </div>
                <div className="w-full">
                  <Label>Giá xuất</Label>
                  <Input type="number" placeholder="Giá xuất" value={item.export_price} onChange={(e) => handleDetailChange(index, "export_price", e.target.value)} min={0} required />
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
