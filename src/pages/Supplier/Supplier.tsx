import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Edit, TrashBinIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import Blank from "../Blank";
import { toast } from "react-toastify";
import { Confirm } from "../../components/ui/confirm/Confirm";
import { Suppliers } from "../../types/index";
import { AddSupplier } from "./AddSupplier";
import { EditSupplier } from "./EditSupplier";
export default function SupperlierManagement() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [supplier, setSupplier] = useState<Suppliers[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<Suppliers | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchSupplier = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/suppliers`);
      setSupplier(res.data.suppliers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(`${API_URL}/api/suppliers/${id}`);
      fetchSupplier();
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  const tableCell = ["STT", "Tên nhà cung cấp", "Email", "Số điện thoại", "Ngày tạo", "Ngày cập nhật", "Thao tác"];
  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý nhà cung cấp" />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5 flex justify-between">
            <div></div>
            <Button size="sm" onClick={() => setModal("add")}>
              Thêm
            </Button>
          </div>
        </div>
        {supplier.length > 0 ? (
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
                    {supplier.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{index + 1}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center capitalize">{item.name}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{item.email}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center capitalize">{item.phoneNumber}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">
                          {item.createdAt && !isNaN(new Date(item.createdAt).getTime()) ? format(new Date(item.createdAt), "HH:mm dd/MM/yyyy") : "Không xác định"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">
                          {item.updatedAt && !isNaN(new Date(item.updatedAt).getTime()) ? format(new Date(item.updatedAt), "HH:mm dd/MM/yyyy") : "Không xác định"}
                        </TableCell>
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
          <Blank tittle="Không có nhà cung cấp" description="Không tìm thấy nhà cung cấp trên từ hệ thống!" />
        )}
      </div>
      {showConfirm && (
        <Confirm
          title="Bạn chắc chắn muốn xóa nhà cung cấp này?"
          message="Nhà cung cấp sẽ không thể phục hồi sau khi xoá."
          onConfirm={() => {
            if (selected) {
              handleDelete(selected.id);
            }
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {modal === "add" && <AddSupplier setClose={() => setModal(null)} refresh={fetchSupplier} />}
      {modal === "edit" && selected && <EditSupplier supplier={selected} setClose={() => setModal(null)} refresh={fetchSupplier} />}
    </>
  );
}
