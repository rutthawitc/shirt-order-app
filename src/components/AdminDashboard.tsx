import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileImage } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface OrderItem {
  design: string;
  size: string;
  quantity: number;
  price_per_unit: number;
}

interface Order {
  id: number;
  name: string;
  address: string;
  is_pickup: boolean;
  total_price: number;
  slip_image: string;
  created_at: string;
  items: OrderItem[];
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showSlipDialog, setShowSlipDialog] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };
  
  const viewSlipImage = (order: Order) => {
    setSelectedOrder(order);
    setShowSlipDialog(true);
  };

  const handleExport = async () => {
    try {
        const response = await fetch('/api/orders/export');
        if (!response.ok) {
            throw new Error('การส่งออกข้อมูลล้มเหลว');
        }

        // ดาวน์โหลดไฟล์
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_export_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Export error:', error);
        // แสดง error message (ถ้ามี UI component สำหรับแสดง error)
    }
};

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>รายการสั่งซื้อทั้งหมด</CardTitle>
          <Button
                        onClick={handleExport}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        ส่งออกข้อมูล
                    </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัสสั่งซื้อ</TableHead>
                <TableHead>วันที่</TableHead>
                <TableHead>ชื่อผู้สั่ง</TableHead>
                <TableHead>ที่อยู่/วิธีรับ</TableHead>
                <TableHead className="text-right">ยอดรวม</TableHead>
                <TableHead>สลิป</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                  <TableCell>{order.name}</TableCell>
                  <TableCell>
                    {order.is_pickup ? 'รับหน้าร้าน' : order.address}
                  </TableCell>
                  <TableCell className="text-right">
                    {order.total_price.toLocaleString()} บาท
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewSlipImage(order)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FileImage className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewOrderDetails(order)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showSlipDialog} onOpenChange={setShowSlipDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>สลิปการโอนเงิน</DialogTitle>
            <DialogDescription>
              ภาพสลิปการโอนเงินจากลูกค้า
            </DialogDescription>
          </DialogHeader>
          {selectedOrder?.slip_image && (
            <div className="max-h-[70vh] overflow-auto">
              <img
                src={selectedOrder.slip_image}
                alt="สลิปการโอนเงิน"
                className="w-full h-auto object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>รายละเอียดคำสั่งซื้อ #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              แสดงข้อมูลการสั่งซื้อและรายการสินค้าทั้งหมด
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">ข้อมูลผู้สั่ง</h3>
                  <p>ชื่อ: {selectedOrder.name}</p>
                  <p>วิธีรับสินค้า: {selectedOrder.is_pickup ? 'รับหน้าร้าน' : 'จัดส่ง'}</p>
                  {!selectedOrder.is_pickup && <p>ที่อยู่: {selectedOrder.address}</p>}
                </div>
                <div>
                  <h3 className="font-semibold">ข้อมูลการสั่งซื้อ</h3>
                  <p>วันที่: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                  <p>ยอดรวม: {selectedOrder.total_price.toLocaleString()} บาท</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">รายการสินค้า</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>สินค้า</TableHead>
                      <TableHead>ขนาด</TableHead>
                      <TableHead className="text-center">จำนวน</TableHead>
                      <TableHead className="text-right">ราคาต่อชิ้น</TableHead>
                      <TableHead className="text-right">รวม</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.design}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {item.price_per_unit.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {(item.price_per_unit * item.quantity).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;