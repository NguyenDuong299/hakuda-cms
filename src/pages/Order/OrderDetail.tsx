import axios from "axios";
import Button from "../../components/ui/button/Button";
import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import { toast } from "react-toastify";
import { Orders } from "../../types/index";
interface Props {
  order: Orders;
  setClose: () => void;
  refresh: () => void;
}

export const OrderDetail = ({ order, setClose, refresh }: Props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    id: 0,
    user_id: 0,
    voucher_id: 0,
    total_price: 0,
    recipient_name: "",
    recipient_email: "",
    recipient_phone: "",
    recipient_address: "",
    note: "",
    status: "",
    order_items: [] as { id: number; code: string; brand: string; price: number; quantity: number; product_line: string; product_name: string }[],
  });
  useEffect(() => {
    if (order) {
      setForm({
        id: order.id || 0,
        user_id: order.user_id || 0,
        voucher_id: order.voucher_id || 0,
        total_price: order.total_price || 0,
        recipient_name: order.recipient_name || "",
        recipient_email: order.recipient_email || "",
        recipient_phone: order.recipient_phone || "",
        recipient_address: order.recipient_address || "",
        note: order.note || "",
        status: order.status || "",
        order_items:
          order.order_items?.map(({ id, code, brand, price, quantity, product_line, product_name }) => ({
            id,
            code,
            brand,
            price,
            quantity,
            product_line,
            product_name,
          })) || [],
      });
    }
  }, [order]);

  const getNextStatus = (current: string): string | null => {
    switch (current) {
      case "pending":
        return "confirmed";
      case "confirmed":
        return "shipped";
      case "shipped":
        return "delivered";
      default:
        return null;
    }
  };

  const getNextStatusLabel = (current: string): string => {
    switch (current) {
      case "pending":
        return "Xác nhận";
      case "confirmed":
        return "Giao hàng";
      case "shipped":
        return "Xác nhận nhận hàng";
      default:
        return "Đã hoàn tất / Hủy";
    }
  };
  const handleSubmit = async () => {
    const nextStatus = getNextStatus(form.status);
    if (!nextStatus) {
      toast.info("Trạng thái đơn hàng đã ở mức cuối cùng.");
      return;
    }
    try {
      await axios.put(`${API_URL}/api/orders/${form.id}`, { status: nextStatus });
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
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Chi tiết đơn hàng</h2>
        <div>
          <div className="mb-4">
            <Label>ID khách hàng</Label>
            <p>{form.user_id}</p>
          </div>
          <div className="mb-4">
            <Label>Tên người nhận hàng</Label>
            <p>{form.recipient_name}</p>
          </div>
          <div className="mb-4">
            <Label>Email người nhận hàng</Label>
            <p>{form.recipient_email}</p>
          </div>
          <div className="mb-4">
            <Label>Số điện thoại người nhận</Label>
            <p>{form.recipient_phone}</p>
          </div>
          <div className="mb-4">
            <Label>Địa chỉ người nhận</Label>
            <p>{form.recipient_address}</p>
          </div>
          {form.voucher_id > 0 && (
            <div className="mb-4">
              <Label>ID voucher</Label>
              <p>{form.voucher_id}</p>
            </div>
          )}
          <div className="mb-4">
            <Label>Tổng giá</Label>
            <p>{Number(form.total_price).toLocaleString("vi-VN")}VNĐ</p>
          </div>
          {form.note && (
            <div className="mb-4">
              <Label>Ghi chú</Label>
              <p>{form.note}</p>
            </div>
          )}

          {form.order_items?.map((item, index) => (
            <div key={index} className="mb-4 border p-4 rounded shadow-sm">
              <p className="font-semibold uppercase mb-2">Sản phẩm {index + 1}</p>
              <p>
                <strong>Tên:</strong> {item.product_name}
              </p>
              <p>
                <strong>Mã:</strong> {item.code}
              </p>
              <p>
                <strong>Số lượng:</strong> {item.quantity}
              </p>
              <p>
                <strong>Giá:</strong> {Number(item.price).toLocaleString("vi-VN")}VNĐ
              </p>
              <p>
                <strong>Thương hiệu:</strong> {item.brand}
              </p>
              <p>
                <strong>Dòng sản phẩm:</strong> {item.product_line}
              </p>
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={setClose}>
              Đóng
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={!getNextStatus(form.status)}>
              {getNextStatus(form.status) ? `${getNextStatusLabel(form.status)}` : "Đã hoàn tất"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
