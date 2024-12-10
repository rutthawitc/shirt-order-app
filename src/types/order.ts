// src/types/order.ts
export interface ShirtDesign {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
  }
  
  export interface OrderItem {
    design: string;
    size: string;
    quantity: number;
  }
  
  export interface CustomerInfo {
    name: string;
    address: string;
    slipImage: File | null;
    isPickup: boolean;
  }
  
  export type ShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';