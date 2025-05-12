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
import { Orders } from "../../types/index";
import { OrderDetail } from "./OrderDetail";
import { EyeIcon } from "../../icons/index";

export default function OrderManagent() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [order, setOrder] = useState<Orders[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<Orders | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / 10);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders`, {
        params: {
          page,
          search: debouncedSearch,
        },
      });
      setOrder(res.data.orders);
      setTotal(res.data.totalOrder);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [page, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(`${API_URL}/api/orders/${id}`);
      fetchOrder();
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  const formatStatusLabel = (status: string): string => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Giao hàng thành công";
      default:
        return status;
    }
  };
  const tableCell = ["STT", "ID khách hàng", "Tên người nhận", "Số điện thoại người nhận", "Tổng tiền", "Trạng thái", "Ngày tạo", "Ngày cập nhật", "Thao tác"];
  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý đơn hàng" />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5 flex justify-between">
            <Input type="text" id="input" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
        {order.length > 0 ? (
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
                    {order.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{index + 1}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center capitalize">{item.user_id}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center capitalize">{item.recipient_name}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center capitalize">{item.recipient_phone}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center capitalize">{Number(item.total_price).toLocaleString("vi-VN")}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{formatStatusLabel(item.status)}</TableCell>
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
                              className="!bg-[#1959F6]"
                            >
                              <EyeIcon />
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
            {totalPages > 1 && (
              <div className="flex justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] px-6 py-5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index} onClick={() => setPage(index + 1)} className={`${page === index + 1 ? "bg-[#F1F3FF] text-[#465FFF]" : "bg-white text-black"} rounded-lg w-10 h-10 font-medium`}>
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <Blank tittle="Không có đơn hàng" description="Không tìm thấy đơn hàng từ hệ thống!" />
        )}
      </div>
      {showConfirm && (
        <Confirm
          title="Bạn chắc chắn muốn xóa đơn hàng này?"
          message="Đơn hàng sẽ không thể phục hồi sau khi xoá."
          onConfirm={() => {
            if (selected) {
              handleDelete(selected.id);
            }
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {/* {modal === "add" && <AddProduct setClose={() => setModal(null)} refresh={fetchProduct} />} */}
      {modal === "edit" && selected && <OrderDetail order={selected} setClose={() => setModal(null)} refresh={fetchOrder} />}
    </>
  );
}
