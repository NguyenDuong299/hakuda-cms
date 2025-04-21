import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { Users } from "../../types/index";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Edit, TrashBinIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { AddUser } from "./AddUser";
import { EditUser } from "./EditUser";
export default function AccountManagement() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState<Users[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users`);
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const tableCell = ["STT", "Họ và tên", "Email", "Số điện thoại", "Ngày tạo", "Cập nhật cuối", "Thao tác"];
  return (
    <>
      <PageBreadcrumb pageTitle="Quản lý người dùng" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5 flex justify-between">
            <Input type="text" id="input" placeholder="Search" />
            <Button size="sm" onClick={() => setModal("add")}>
              Thêm
            </Button>
          </div>
        </div>
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
                {user.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{index + 1}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{item.lastName + " " + item.firstName}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{item.email}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{item.phoneNumber}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{format(new Date(item.created_at), "HH:mm dd/MM/yyyy")}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{format(new Date(item.updated_at), "HH:mm dd/MM/yyyy")}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" className="!bg-[#12B274]">
                          <Edit />
                        </Button>
                        <Button size="sm" className="!bg-[#FF0000]">
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
      </div>

      {modal === "add" && <AddUser setClose={() => setModal(null)} refresh={fetchUsers} />}
      {modal === "edit" && <EditUser user={user} setClose={() => setModal(null)} refresh={fetchUsers} />}
    </>
  );
}
