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
import { ProductLines } from "../../types";
import { EditProductLine } from "./EditProductLine";
import { AddProductLine } from "./AddProductLine";
export default function ProductLineManagement() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [productLine, setProductLine] = useState<ProductLines[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<ProductLines | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / 10);

  const fetchProductLine = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/product-lines`, {
        params: {
          page,
          search: debouncedSearch,
        },
      });
      setProductLine(res.data.productLines);
      setTotal(res.data.totalProductLine);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchProductLine();
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
      const res = await axios.delete(`${API_URL}/api/product-lines/${id}`);
      fetchProductLine();
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  const tableCell = ["STT", "Tên dòng sản phẩm", "Logo", "Ngày tạo", "Ngày cập nhật", "Thao tác"];
  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý dòng sản phẩm" />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5 flex justify-between">
            <Input type="text" id="input" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Button size="sm" onClick={() => setModal("add")}>
              Thêm
            </Button>
          </div>
        </div>
        {productLine.length > 0 ? (
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
                    {productLine.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{index + 1}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center capitalize">{item.name}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 flex justify-center">
                          {item.image ? (
                            <img src={`${API_URL}/${item.image}`} alt="image" className="w-20 h-20 object-cover" />
                          ) : (
                            <img src="/images/uploads/error-img.jpg" alt="image" className="w-20 h-20 object-cover" />
                          )}
                        </TableCell>
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
          <Blank tittle="Không có dòng sản phẩm" description="Không tìm thấy dòng sản phẩm trên từ hệ thống!" />
        )}
      </div>
      {showConfirm && (
        <Confirm
          title="Bạn chắc chắn muốn xóa dòng sản phẩm này?"
          message="Dòng sản phẩm sẽ không thể phục hồi sau khi xoá."
          onConfirm={() => {
            if (selected) {
              handleDelete(selected.id);
            }
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {modal === "add" && <AddProductLine setClose={() => setModal(null)} refresh={fetchProductLine} />}
      {modal === "edit" && selected && <EditProductLine productLine={selected} setClose={() => setModal(null)} refresh={fetchProductLine} />}
    </>
  );
}
