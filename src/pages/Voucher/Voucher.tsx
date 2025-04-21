import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Edit, TrashBinIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Blank from "../Blank";
import { toast } from "react-toastify";
import { Confirm } from "../../components/ui/confirm/Confirm";
import { Vouchers } from "../../types";
export default function VoucherManagement() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [voucher, setVoucher] = useState<Vouchers[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<Vouchers | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const fetchVoucher = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/vouchers`);
      setVoucher(res.data.vouchers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchVoucher();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`${API_URL}/api/vouchers/${id}`);
      fetchVoucher();
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const tableCell = ["STT", "Loại mã", "Giá giảm", "Số lượng", "Tình trạng", "Bắt đầu", "Kết thúc", "Ngày tạo", "Ngày cập nhật", "Thao tác"];
  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý voucher" />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5 flex justify-between">
            <Input type="text" id="input" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Button size="sm" onClick={() => setModal("add")}>
              Thêm
            </Button>
          </div>
        </div>
        {voucher.length > 0 ? (
          <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      {tableCell.map((item, index) => (
                        <TableCell key={index} isHeader className="px-4 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 text-center">
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {voucher.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{index + 1}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center capitalize">{item.discountType} Code</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">
                          {Math.floor(item.discountValue)}
                          {item.discountType === "percentage" ? "%" : "VNĐ"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{item.quantity}</TableCell>
                        <TableCell className="px-4 py-3 text-center text-theme-sm">
                          <span className={false ? "text-red-500 font-semibold" : "text-green-500 font-semibold"}>{new Date() > new Date(item.endDate) ? "Quá hạn" : "Còn hạn"}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{format(new Date(item.startDate), "HH:mm dd/MM/yyyy")}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{format(new Date(item.endDate), "HH:mm dd/MM/yyyy")}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{format(new Date(item.createdAt), "HH:mm dd/MM/yyyy")}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{format(new Date(item.updatedAt), "HH:mm dd/MM/yyyy")}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">
                          <div className="flex gap-2 justify-center">
                            <Button
                              onClick={() => {
                                setModal("edit");
                                setSelected(item);
                              }}
                              size="sm"
                              className="!bg-[#12B274]"
                            >
                              <Edit />
                            </Button>
                            <Button
                              size="sm"
                              className="!bg-[#FF0000]"
                              onClick={() => {
                                setSelected(item);
                                setShowConfirm(true);
                              }}
                            >
                              <TrashBinIcon />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        ) : (
          <Blank tittle="Không có voucher" description="Không tìm thấy voucher trên từ hệ thống!" />
        )}
      </div>
      {showConfirm && (
        <Confirm
          title="Bạn chắc chắn muốn xóa người dùng này?"
          message="Người dùng sẽ không thể phục hồi sau khi xoá."
          onConfirm={() => {
            if (selected) {
              handleDelete(selected.id);
            }
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {/* {modal === "edit" && <EditUser user={selected} setClose={() => setModal(null)} refresh={fetchVoucher} />} */}
    </>
  );
}
