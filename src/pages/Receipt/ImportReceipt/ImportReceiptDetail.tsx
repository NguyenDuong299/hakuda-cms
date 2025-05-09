import Button from "../../../components/ui/button/Button";
import { useEffect, useState } from "react";
import Label from "../../../components/form/Label";
import { format } from "date-fns";
import { ImportReceipts } from "../../../types";

interface Props {
  importReceipt: ImportReceipts;
  setClose: () => void;
}

export const ImportReceiptDetail = ({ importReceipt, setClose }: Props) => {
  const [form, setForm] = useState({
    id: 0,
    supplier_id: 0,
    supplier_name: "",
    import_date: "",
    total_amount: 0,
    note: "",
    createAt: "",
    updateAt: "",
    import_receipt_details: [] as { quantity: number; import_price: number; product_id: number; createdAt: string; updatedAt: string }[],
  });
  useEffect(() => {
    if (importReceipt)
      setForm({
        id: importReceipt.id,
        supplier_id: importReceipt.supplier_id,
        supplier_name: importReceipt.supplier_name,
        import_date: importReceipt.import_date,
        total_amount: importReceipt.total_amount,
        note: importReceipt.note,
        createAt: importReceipt.createdAt,
        updateAt: importReceipt.updatedAt,
        import_receipt_details:
          importReceipt.import_receipt_details?.map(({ quantity, import_price, product_id, createdAt, updatedAt }) => ({
            quantity,
            import_price,
            product_id,
            createdAt,
            updatedAt,
          })) || [],
      });
  }, [importReceipt]);
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-3xl shadow-lg relative border border-gray-200 dark:border-white/[0.1] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Tạo phiếu nhập kho</h2>
        <div>
          <div className="mb-4">
            <Label>ID phiếu xuất kho</Label>
            <p>{form.id}</p>
          </div>
          <div className="mb-4">
            <Label>Tên nhà cung cấp</Label>
            <p>{form.supplier_name}</p>
          </div>

          {form.import_date && (
            <div className="mb-4">
              <Label>Ngày xuất kho</Label>
              <p> {format(new Date(form.import_date), "dd/MM/yyyy")}</p>
            </div>
          )}
          <div className="mb-4">
            <Label>Tổng giá</Label>
            <p>{Number(form.total_amount).toLocaleString("vi-VN")}VNĐ</p>
          </div>
          <div className="mb-4">
            <Label>Ghi chú</Label>
            <p>{form.note}</p>
          </div>
          {form.createAt && (
            <div className="mb-4">
              <Label>Ngày tạo phiếu xuất</Label>
              <p> {format(new Date(form.createAt), "HH:mm dd/MM/yyyy")}</p>
            </div>
          )}
          {form.updateAt && (
            <div className="mb-4">
              <Label>Ngày cập nhật</Label>
              <p> {format(new Date(form.updateAt), "HH:mm dd/MM/yyyy")}</p>
            </div>
          )}

          {form.import_receipt_details.length > 0 &&
            form.import_receipt_details.map((item, index) => (
              <div key={index} className="mb-4 border p-4 rounded shadow-sm">
                <p className="font-semibold uppercase mb-2">Chi tiết hoá đơn {index + 1}</p>
                <p>
                  <strong>ID sản phẩm:</strong> {item.product_id}
                </p>
                <p>
                  <strong>Số lượng</strong> {item.quantity}
                </p>
                <p>
                  <strong>Giá:</strong> {Number(item.import_price).toLocaleString("vi-VN")}VNĐ
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
          </div>
        </div>
      </div>
    </div>
  );
};
