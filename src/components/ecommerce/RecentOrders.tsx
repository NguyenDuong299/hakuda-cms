import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import { Orders } from "../../types";
import axios from "axios";
import { Link } from "react-router";
export default function RecentOrders() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [order, setOrder] = useState<Orders[]>([]);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/orders`);
        setOrder(res.data.orders);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOrder();
  }, [API_URL]);
  const statusDefined = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Giao hàng thành công";
      case "cancelled":
        return "Đã huỷ";
      default:
        return status;
    }
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Đơn hàng gần đây</h3>
        <Link to="/order" className="text-sm font-semibold text-gray-800 dark:text-white/90 hover:underline dark:text-brand-400">
          Xem thêm
        </Link>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Sản phẩm
              </TableCell>
              <TableCell isHeader className="py-3 px-5 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 text-nowrap">
                Số lượng
              </TableCell>
              <TableCell isHeader className="py-3 px-5 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 text-nowrap">
                Giá
              </TableCell>
              <TableCell isHeader className="py-3 px-5 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 text-nowrap">
                Trạng thái
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {order.slice(0, 4).map((orderItem) =>
              orderItem.order_items.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="py-3 pr-10">
                    <div className="flex items-center gap-3">
                      <div className="h-[60px] w-[60px] overflow-hidden rounded-md">
                        {product.images && product.images.length > 0 ? (
                          product.images
                            .filter((img) => img && img.isThumbnail && img.image_url)
                            .slice(0, 1)
                            .map((img, index) => <img key={index} src={`${API_URL}/${img.image_url}`} alt="thumbnail" className="object-cover" />)
                        ) : (
                          <img src="/images/uploads/error-img.jpg" alt="thumbnail" className="h-[60px] w-[60px] object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{product.product_name}</p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {product.brand} - {product.product_line}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-5 text-gray-500 text-theme-sm dark:text-gray-400 text-nowrap">{product.quantity}</TableCell>
                  <TableCell className="py-3 px-5 text-gray-500 text-theme-sm dark:text-gray-400 text-nowrap">{Number(product.price).toLocaleString("vi-VN")}</TableCell>
                  <TableCell className="py-3 px-5 text-gray-500 text-theme-sm dark:text-gray-400 text-nowrap">
                    <Badge size="sm">{statusDefined(orderItem.status)}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
