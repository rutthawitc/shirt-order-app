// src/components/ShirtOrderForm.tsx
import React, { useState, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Upload, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

import type { OrderItem, CustomerInfo } from "@/types/order";
import { SHIRT_DESIGNS, SIZES } from "@/constants/shirt-designs";

const ShirtOrderForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      design: "1",
      size: "M",
      quantity: 1,
    },
  ]);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    address: "",
    slipImage: null,
    isPickup: false,
  });

  const calculateTotalPrice = (): number => {
    return orderItems.reduce((total, item) => {
      const design = SHIRT_DESIGNS.find((d) => d.id === item.design);
      return total + (design?.price ?? 0) * item.quantity;
    }, 0);
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setOrderItems(newItems);
  };

  const addItem = () => {
    setOrderItems([
      ...orderItems,
      {
        design: "1",
        size: "M",
        quantity: 1,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (orderItems.length > 1) {
      const newItems = orderItems.filter((_, i) => i !== index);
      setOrderItems(newItems);
    }
  };

  const handleCustomerInfoChange = (
    field: keyof CustomerInfo,
    value: string | File | null | boolean
  ) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // บันทึกไฟล์ใน state
      handleCustomerInfoChange("slipImage", file);

      // สร้าง preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    if (orderItems.length === 0) {
      setError("กรุณาเพิ่มรายการสั่งซื้ออย่างน้อย 1 รายการ");
      return false;
    }
    if (!customerInfo.name.trim()) {
      setError("กรุณากรอกชื่อ-นามสกุล");
      return false;
    }
    if (!customerInfo.isPickup && !customerInfo.address.trim()) {
      setError("กรุณากรอกที่อยู่จัดส่ง");
      return false;
    }
    if (!customerInfo.slipImage) {
      setError("กรุณาอัพโหลดสลิปการโอนเงิน");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate form
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      // Prepare form data
      const formData = new FormData();

      // Add customer info
      formData.append("name", customerInfo.name);
      formData.append("address", customerInfo.address);
      formData.append("isPickup", customerInfo.isPickup.toString());

      // Add order items as JSON string
      formData.append("items", JSON.stringify(orderItems));

      // Add total price
      const totalPrice = calculateTotalPrice();
      formData.append("totalPrice", totalPrice.toString());

      // Add slip image if exists
      if (customerInfo.slipImage) {
        formData.append("slipImage", customerInfo.slipImage);
      }

      console.log("Sending form data:", {
        name: customerInfo.name,
        address: customerInfo.address,
        isPickup: customerInfo.isPickup,
        items: orderItems,
        totalPrice,
      });

      const response = await fetch("/api/order", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ");
      }

      const result = await response.json();
      console.log("Order submitted successfully:", result);

      setShowSuccess(true);
      // Reset form
      setOrderItems([
        {
          design: "1",
          size: "M",
          quantity: 1,
        },
      ]);
      setCustomerInfo({
        name: "",
        address: "",
        slipImage: null,
        isPickup: false,
      });
      setPreviewImage(null);
    } catch (error) {
      console.error("Order submission error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>สั่งจองเสื้อ</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* แสดงตัวอย่างเสื้อทั้งหมด */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                แบบเสื้อที่มีให้เลือก
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SHIRT_DESIGNS.map((design) => (
                  <Card key={design.id} className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-2 p-2">
                      {design.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${design.name} - มุมที่ ${idx + 1}`}
                          className="w-full h-40 object-cover rounded"
                          loading="lazy"
                        />
                      ))}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold">{design.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {design.description}
                      </p>
                      <p className="font-semibold text-lg">
                        {design.price} บาท
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* รายการสั่งซื้อเสื้อ */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">รายการสั่งซื้อ</h3>
                <Button
                  type="button"
                  onClick={addItem}
                  className="flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มรายการ
                </Button>
              </div>

              {orderItems.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">รายการที่ {index + 1}</h4>
                      {orderItems.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="flex items-center"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-2">แบบเสื้อ</label>
                        <Select
                          value={item.design}
                          onValueChange={(value) =>
                            handleItemChange(index, "design", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกแบบเสื้อ" />
                          </SelectTrigger>
                          <SelectContent>
                            {SHIRT_DESIGNS.map((design) => (
                              <SelectItem key={design.id} value={design.id}>
                                {design.name} - {design.price} บาท
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block mb-2">ขนาด</label>
                        <Select
                          value={item.size}
                          onValueChange={(value) =>
                            handleItemChange(index, "size", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกขนาด" />
                          </SelectTrigger>
                          <SelectContent>
                            {SIZES.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block mb-2">จำนวน</label>
                        <Select
                          value={item.quantity.toString()}
                          onValueChange={(value) =>
                            handleItemChange(index, "quantity", parseInt(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกจำนวน" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          SHIRT_DESIGNS.find((d) => d.id === item.design)
                            ?.images[0]
                        }
                        alt="ตัวอย่างเสื้อที่เลือก"
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="text-right flex-1">
                        <div className="text-sm text-gray-600">
                          {
                            SHIRT_DESIGNS.find((d) => d.id === item.design)
                              ?.description
                          }
                        </div>
                        <div className="font-semibold">
                          ราคา:{" "}
                          {(SHIRT_DESIGNS.find((d) => d.id === item.design)
                            ?.price ?? 0) * item.quantity}{" "}
                          บาท
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* แสดงราคารวม */}
            <div className="text-right space-y-2">
              <div className="text-xl font-semibold">
                ราคารวมทั้งสิ้น: {calculateTotalPrice()} บาท
              </div>
            </div>
              <div>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-lg font-semibold">ข้อมูลบัญชีสำหรับโอนเงิน</p>
                <p className="text-sm">ชื่อบัญชี: นายสกล สกลสกล</p>
                <p className="text-sm">เลขที่บัญชี: 123-456-7890</p>
                <p className="text-sm">ธนาคาร: ธนาคารไทยพาณิชย์</p>
              </div>
              

              </div>
            {/* ข้อมูลลูกค้า */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">ข้อมูลการจัดส่ง</h3>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pickup"
                  checked={customerInfo.isPickup}
                  onCheckedChange={(checked) =>
                    handleCustomerInfoChange("isPickup", checked === true)
                  }
                />
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="pickup"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    รับหน้างาน
                  </label>
                  {!customerInfo.isPickup && (
                    <span className="text-sm font-medium text-red-500">
                      (หรือจัดส่งตามที่อยู่)
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2">ชื่อ-นามสกุล</label>
                  <Input
                    value={customerInfo.name}
                    onChange={(e) =>
                      handleCustomerInfoChange("name", e.target.value)
                    }
                    placeholder="กรอกชื่อ-นามสกุล"
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    ที่อยู่จัดส่ง{" "}
                    {!customerInfo.isPickup && (
                      <span className="text-sm text-gray-500">(ค่าจัดส่ง)</span>
                    )}
                  </label>
                  <Textarea
                    value={customerInfo.address}
                    onChange={(e) =>
                      handleCustomerInfoChange("address", e.target.value)
                    }
                    placeholder={
                      customerInfo.isPickup
                        ? "ไม่ต้องระบุที่อยู่ (รับหน้างาน)"
                        : "กรอกที่อยู่จัดส่ง"
                    }
                    disabled={customerInfo.isPickup}
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    อัพโหลดสลิปการโอนเงิน{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="slip-upload"
                    />
                    <label
                      htmlFor="slip-upload"
                      className={`flex items-center px-4 py-2 ${
                        customerInfo.slipImage ? "bg-green-500" : "bg-blue-500"
                      } text-white rounded cursor-pointer hover:opacity-90`}
                    >
                      {customerInfo.slipImage ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          เลือกไฟล์แล้ว
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          เลือกไฟล์
                        </>
                      )}
                    </label>
                    {customerInfo.slipImage && (
                      <span className="text-sm text-gray-600">
                        {customerInfo.slipImage.name}
                      </span>
                    )}
                  </div>
                  {!customerInfo.slipImage && (
                    <p className="mt-1 text-sm text-red-500">
                      * กรุณาอัพโหลดสลิปการโอนเงิน
                    </p>
                  )}
                  {previewImage && (
                    <div className="mt-2">
                      <img
                        src={previewImage}
                        alt="สลิปการโอนเงิน"
                        className="max-w-xs rounded shadow"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังส่งคำสั่งซื้อ...
                </>
              ) : (
                "ยืนยันการสั่งซื้อ"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>สั่งซื้อสำเร็จ</DialogTitle>
            <DialogDescription>
              ขอบคุณสำหรับการสั่งซื้อ เราได้รับคำสั่งซื้อของคุณเรียบร้อยแล้ว
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowSuccess(false)}>ปิด</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShirtOrderForm;
