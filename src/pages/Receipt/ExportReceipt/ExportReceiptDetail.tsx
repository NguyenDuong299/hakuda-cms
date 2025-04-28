import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ExportReceipts } from "../../../types/index";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { format } from "date-fns";
interface Props {
  exportReceipt: ExportReceipts;
  setClose: () => void;
  refresh: () => void;
}

export const ExportReceiptsDetail = ({ exportReceipt, setClose, refresh }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    id: 0,
    order_id: 0,
    export_date: "",
    total_amount: 0,
    user_id: 0,
    status: "",
    createAt: "",
    updateAt: "",
    export_receipt_details: [] as { id: number; quantity: number; product_id: number; export_price: number; createdAt: string; updatedAt: string }[],
  });
  useEffect(() => {
    if (exportReceipt) {
      setForm({
        id: exportReceipt.id,
        order_id: exportReceipt.order_id,
        export_date: exportReceipt.export_date,
        total_amount: exportReceipt.total_amount,
        user_id: exportReceipt.user_id,
        status: exportReceipt.status,
        createAt: exportReceipt.createdAt,
        updateAt: exportReceipt.updatedAt,
        export_receipt_details:
          exportReceipt.export_receipt_details?.map(({ id, quantity, product_id, export_price, createdAt, updatedAt }) => ({
            id,
            quantity,
            product_id,
            export_price,
            createdAt,
            updatedAt,
          })) || [],
      });
    }
  }, [exportReceipt]);
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "cancelled":
        return "Đã huỷ";
      default:
        return "Không xác định";
    }
  };
  const getNextStatus = (current: string): string[] => {
    switch (current) {
      case "pending":
        return ["completed", "cancelled"];
      case "completed":
        return ["cancelled"];
      default:
        return [];
    }
  };
  const handleSubmit = async (nextStatus: string) => {
    try {
      await axios.put(`${API_URL}/api/export-receipts/${form.id}`, { status: nextStatus });
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      refresh();
      setClose();
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại!");
      console.error(error);
    }
  };
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-6xl shadow-lg relative border border-gray-200 dark:border-white/[0.1] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Chi tiết phiếu xuất kho</h2>
        <div>
          <div className="mb-4">
            <Label>ID phiếu xuất kho</Label>
            <p>{form.id}</p>
          </div>
          {form.user_id > 0 && (
            <div className="mb-4">
              <Label>ID khách hàng</Label>
              <p>{form.user_id}</p>
            </div>
          )}
          <div className="mb-4">
            <Label>Tổng giá</Label>
            <p>{form.total_amount}</p>
          </div>
          {form.export_date && (
            <div className="mb-4">
              <Label>Ngày xuất kho</Label>
              <p> format(new Date(form.export_date), "HH:mm dd/MM/yyyy")d</p>
            </div>
          )}
          <div className="mb-4">
            <Label>Trạng thái</Label>
            <p>{form.status}</p>
          </div>
          <div className="mb-4">
            <Label>Ngày tạo phiếu xuất</Label>
            <p>{form.createAt}</p>
          </div>
          <div className="mb-4">
            <Label>Ngày cập nhật</Label>
            <p>{form.updateAt}</p>
          </div>

          {form.export_receipt_details.length > 0 &&
            form.export_receipt_details.map((item, index) => (
              <div key={index} className="mb-4 border p-4 rounded shadow-sm">
                <p className="font-semibold uppercase mb-2">Chi tiết hoá đơn {index + 1}</p>
                <p>
                  <strong>ID sản phẩm:</strong> {item.product_id}
                </p>
                <p>
                  <strong>Số lượng</strong> {item.quantity}
                </p>
                <p>
                  <strong>Giá:</strong> {item.export_price}
                </p>
                <p>
                  <strong>Ngày tạo:</strong> {format(new Date(item.createdAt), "HH:mm dd/MM/yyyy")}
                </p>
                <p>
                  <strong>Ngày cập nhật:</strong> {format(new Date(item.updatedAt), "HH:mm dd/MM/yyyy")}
                </p>
              </div>
            ))}

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={setClose}>
              Đóng
            </Button>
            {getNextStatus(form.status).map((status) => (
              <Button key={status} type="button" onClick={() => handleSubmit(status)}>
                Chuyển trạng thái: {getStatusLabel(status)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
