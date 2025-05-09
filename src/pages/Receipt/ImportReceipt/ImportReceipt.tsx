import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Button from "../../../components/ui/button/Button";
import Blank from "../../Blank";
import { ImportReceipts } from "../../../types/index";
import { EyeIcon } from "../../../icons/index";
import Input from "../../../components/form/input/InputField";
import { AddImportReceipt } from "./AddImportReceipt";
import { ImportReceiptDetail } from "./ImportReceiptDetail";

export default function ImportReceiptManagement() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [importReceipt, setImportReceipt] = useState<ImportReceipts[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ImportReceipts | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / 10);

  const fetchImportReceipt = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/import-receipts`, {
        params: {
          page,
          search: debouncedSearch,
        },
      });
      setImportReceipt(res.data.importReceipts);
      setTotal(res.data.totalImportReceipt);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchImportReceipt();
  }, [page, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const tableCell = ["STT", "Tên nhà cung cấp", "Nhập ngày", "Tổng giá", "Ghi chú", "Ngày tạo", "Ngày cập nhật", "Thao tác"];
  return (
    <>
      {modal === "add" && <AddImportReceipt setClose={() => setModal(null)} refresh={fetchImportReceipt} />}
      {modal === "edit" && selected && <ImportReceiptDetail importReceipt={selected} setClose={() => setModal(null)} />}
      <PageBreadcrumb pageTitle="Quản lý nhập kho" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5 flex justify-between">
            <Input type="text" id="input" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Button size="sm" onClick={() => setModal("add")}>
              Thêm
            </Button>
          </div>
        </div>
        {importReceipt.length > 0 ? (
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
                    {importReceipt.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{index + 1}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{item.supplier_name}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center capitalize">{format(new Date(item.import_date), "dd/MM/yyyy")}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center capitalize">{Number(item.total_amount).toLocaleString("vi-VN")}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center capitalize">{item.note}</TableCell>
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
          <Blank tittle="Không có dữ liệu" description="Không tìm thấy dữ liệu nhập hàng từ hệ thống!" />
        )}
      </div>
    </>
  );
}
