// src/components/AdminOrderTable.tsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileImage, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Order {
  id: number;
  name: string;
  address: string;
  is_pickup: boolean;
  total_price: number;
  slip_image: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderItem {
  design: string;
  size: string;
  quantity: number;
  price_per_unit: number;
}

interface AdminOrderTableProps {
  orders: Order[];
  onViewSlip: (order: Order) => void;
  onViewDetails: (order: Order) => void;
}

const AdminOrderTable: React.FC<AdminOrderTableProps> = ({ orders, onViewSlip, onViewDetails }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const handleUpdateStatus = async (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowConfirmDialog(true);
  };

  const confirmUpdateStatus = async () => {
    if (!selectedOrderId) return;

    try {
      const response = await fetch(`/api/orders/${selectedOrderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'delivered'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      setShowConfirmDialog(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดทสถานะ');
    }
  };

  return (
    <>
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
            <TableHead>สถานะ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
              <TableCell>{order.name}</TableCell>
              <TableCell>
                {order.is_pickup ? 'รับหน้างาน' : order.address}
              </TableCell>
              <TableCell className="text-right">
                {order.total_price.toLocaleString()} บาท
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewSlip(order)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FileImage className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(order)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                {order.status === 'pending' ? (
                  <Button
                    onClick={() => handleUpdateStatus(order.id)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                    size="sm"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    เสร็จสิ้น
                  </Button>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <Check className="mr-1 h-4 w-4" />
                    จัดส่งแล้ว
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการเปลี่ยนสถานะ</DialogTitle>
            <DialogDescription>
              คุณต้องการเปลี่ยนสถานะออเดอร์ #{selectedOrderId} เป็น "จัดส่งแล้ว" ใช่หรือไม่?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setShowConfirmDialog(false)}>
              ยกเลิก
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600"
              onClick={confirmUpdateStatus}
            >
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminOrderTable;