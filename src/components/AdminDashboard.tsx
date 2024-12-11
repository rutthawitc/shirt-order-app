// src/components/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { API_URL } from '@/config';
import AdminOrderTable from '@/components/AdminOrderTable';

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
  status: string;
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
      const response = await fetch(`${API_URL}/api/orders`);
      console.log('Response status:', response.status);
      
      const text = await response.text();
      console.log('Raw response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid response from server');
      }

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
      const response = await fetch(`${API_URL}/api/orders/export`);
      if (!response.ok) {
        throw new Error('การส่งออกข้อมูลล้มเหลว');
      }

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
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
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
          <AdminOrderTable 
            orders={orders}
            onViewSlip={viewSlipImage}
            onViewDetails={viewOrderDetails}
          />
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
                  <p>วิธีรับสินค้า: {selectedOrder.is_pickup ? 'รับหน้างาน' : 'จัดส่ง'}</p>
                  {!selectedOrder.is_pickup && <p>ที่อยู่: {selectedOrder.address}</p>}
                </div>
                <div>
                  <h3 className="font-semibold">ข้อมูลการสั่งซื้อ</h3>
                  <p>วันที่: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                  <p>ยอดรวม: {selectedOrder.total_price.toLocaleString()} บาท</p>
                  <p>สถานะ: {selectedOrder.status === 'pending' ? 'รอดำเนินการ' : 'จัดส่งแล้ว'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">รายการสินค้า</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">สินค้า</th>
                      <th className="text-left p-2">ขนาด</th>
                      <th className="text-center p-2">จำนวน</th>
                      <th className="text-right p-2">ราคาต่อชิ้น</th>
                      <th className="text-right p-2">รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{item.design}</td>
                        <td className="p-2">{item.size}</td>
                        <td className="text-center p-2">{item.quantity}</td>
                        <td className="text-right p-2">
                          {item.price_per_unit.toLocaleString()}
                        </td>
                        <td className="text-right p-2">
                          {(item.price_per_unit * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;