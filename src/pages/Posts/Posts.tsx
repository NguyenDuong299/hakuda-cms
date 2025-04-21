import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { AddPost } from "./AddPost";
import { EditPost } from "./EditPost";
import { Edit, TrashBinIcon } from "../../icons";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { Posts } from "../../types/index";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Confirm } from "../../components/ui/confirm/Confirm";

export default function PostsManager() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [posts, setPosts] = useState<Posts[]>([]);
  const [selected, setSelected] = useState<Posts | null>(null);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const totalPages = Math.ceil(totalPosts / 10);
  const [showConfirm, setShowConfirm] = useState(false);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/posts`, {
        params: {
          page,
          search: debouncedSearch,
        },
      });
      setTotalPosts(res.data.totalPosts);
      setPosts(res.data.posts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const tableCell = ["STT", "Hình ảnh", "Tiêu đề", "Tác giả", "Ngày tạo", "Chỉnh sửa cuối", "Thao tác"];

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`${API_URL}/api/posts/${id}`);
      fetchPosts();
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <>
      {modal === "add" && <AddPost setClose={() => setModal(null)} refresh={fetchPosts} />}
      {modal === "edit" && selected && <EditPost post={selected} setClose={() => setModal(null)} refresh={fetchPosts} />}

      <PageBreadcrumb pageTitle="Quản lý bài viết" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5 flex justify-between">
            <Input type="text" id="input" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                    <TableCell key={index} isHeader className={`px-4 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 text-center ${index === tableCell.length - 1 ? "w-[100px]" : ""}`}>
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {posts.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{index + 1}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 flex justify-center">
                      {item.thumbnail ? (
                        <img src={`${API_URL}/${item.thumbnail}`} alt="thumbnail" className="w-20 h-20 object-cover" />
                      ) : (
                        <img src="/images/uploads/error-img.jpg" alt="thumbnail" className="w-20 h-20 object-cover" />
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{item.title}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center">{item.author}</TableCell>
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
      </div>
      {showConfirm && (
        <Confirm
          title="Bạn chắc chắn muốn xoá bài viết?"
          message="Bài viết sẽ không thể phục hồi sau khi xoá."
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
