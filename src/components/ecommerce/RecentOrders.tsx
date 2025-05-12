import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import { Orders } from "../../types";
import axios from "axios";
export default function RecentOrders() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [order, setOrder] = useState<Orders[]>([]);
  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders`);
      setOrder(res.data.orders);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Đơn hàng gần đây</h3>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Sản phẩm
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Số lượng
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Giá
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Trạng thái
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {order.map((orderItem) =>
              orderItem.order_items.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                        {product.images && product.images.length > 0 ? (
                          product.images
                            .filter((img) => img && img.isThumbnail && img.image_url)
                            .slice(0, 1)
                            .map((img, index) => <img key={index} src={`${API_URL}/${img.image_url}`} alt="thumbnail" className="w-20 h-20 object-cover" />)
                        ) : (
                          <img src="/images/uploads/error-img.jpg" alt="thumbnail" className="h-[50px] w-[50px] object-cover" />
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
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{product.quantity}</TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{product.price.toLocaleString()} ₫</TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={orderItem.status === "delivered" ? "success" : orderItem.status === "pending" ? "warning" : orderItem.status === "cancelled" ? "destructive" : "default"}>
                      {orderItem.status.charAt(0).toUpperCase() + orderItem.status.slice(1)}
                    </Badge>
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
