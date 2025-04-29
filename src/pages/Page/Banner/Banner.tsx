import Button from "../../../components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import { Edit, TrashBinIcon } from "../../../icons";
import { useEffect, useState } from "react";
import { Banners } from "../../../types";
import { format } from "date-fns";
import axios from "axios";
import { EditBanner } from "./EditBanner";
import { Confirm } from "../../../components/ui/confirm/Confirm";
import { toast } from "react-toastify";
import Blank from "../../Blank";
import { AddBanner } from "./AddBanner";

export default function BannerManager() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [banner, setBanner] = useState<Banners[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<Banners | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchBanner = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/banners`);
      setBanner(res.data.banners);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/api/banners/${id}`);
      toast.success("Xoá banner thành công!");
      fetchBanner();
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const tableCell = ["STT", "Hình ảnh", "Tên Banner", "Ngày tạo", "Ngày cập nhật", "Thao tác"];
  return (
    <>
      {modal === "edit" && selected && <EditBanner banner={selected} setClose={() => setModal(null)} refresh={fetchBanner} />}
      {modal === "add" && <AddBanner setClose={() => setModal(null)} refresh={fetchBanner} />}
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5 flex justify-between">
            <div></div>
            <Button size="sm" onClick={() => setModal("add")}>
              Thêm
            </Button>
          </div>
        </div>
        {banner.length > 0 ? (
          <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      {tableCell.map((item, index) => (
                        <TableCell
                          key={index}
                          isHeader
                          className={`px-4 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 text-center ${index === tableCell.length - 1 ? "w-[100px]" : ""}`}
                        >
                          {item}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {banner.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{index + 1}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 flex justify-center">
                          {item.image ? (
                            <img src={`${API_URL}/${item.image}`} alt="thumbnail" className="w-20 h-20 object-cover" />
                          ) : (
                            <img src="/images/uploads/error-img.jpg" alt="thumbnail" className="w-20 h-20 object-cover" />
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{item.name}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{format(new Date(item.created_at), "HH:mm dd/MM/yyyy")}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{format(new Date(item.updated_at), "HH:mm dd/MM/yyyy")}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelected(item);
                                setModal("edit");
                              }}
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
          <Blank tittle="Không có banner" description="Không tìm thấy banner từ hệ thống!" />
        )}
      </div>
      {showConfirm && (
        <Confirm
          title="Bạn chắc chắn muốn xoá Banner?"
          message="Banner này sẽ không thể phục hồi sau khi xoá."
          onConfirm={() => {
            if (selected) {
              handleDelete(selected.id);
            }
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
