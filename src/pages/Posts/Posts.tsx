import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { Posts } from "../../types/index";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { AddPost } from "./AddPost";
import { EditPost } from "./EditPost";
export default function PostsManager() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [post, setPost] = useState<Posts[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/posts`);
        setPost(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPosts();
  }, []);

  const tableCell = ["Hình ảnh", "Tiêu đề", "Tác giả", "Nổi bật", "Thao tác"];
  const [modal, setModal] = useState<"add" | "edit" | null>(null);

  return (
    <>
      {modal === "add" && <AddPost setClose={() => setModal(null)} />}
      {modal === "edit" && <EditPost setClose={() => setModal(null)} />}
      <PageBreadcrumb pageTitle="Quản lý bài viết" />
      <div className="space-y-6">
        <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}>
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
                    <TableCell key={index} isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {post.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{item.thumbnail}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{item.title}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{item.author}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{item.hot}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Button size="sm" onClick={() => setModal("edit")}>
                        Sửa
                      </Button>
                      <Button size="sm">Xóa</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
