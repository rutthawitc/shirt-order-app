// src/constants/shirt-designs.ts
import design1Front from '@/assets/images/shirts/design-1/front.jpg';
import design1Back from '@/assets/images/shirts/design-1/back.jpg';
import design2Front from '@/assets/images/shirts/design-2/front.jpg';
import design2Back from '@/assets/images/shirts/design-2/back.jpg';
import design3Front from '@/assets/images/shirts/design-3/front.jpg';
import design3Back from '@/assets/images/shirts/design-3/back.jpg';
import design4Front from '@/assets/images/shirts/design-4/front.jpg';
import design4Back from '@/assets/images/shirts/design-4/back.jpg';

export const SHIRT_DESIGNS = [
  { 
    id: '1', 
    name: 'แบบที่ 1 เสื้อใส่เข้างาน', 
    price: 750,
    description: 'เสื้อเจอร์ซีย์แขนยาว Tiger Thailand',
    images: [design1Front, design1Back]
  },
  { 
    id: '2', 
    name: 'แบบที่ 2 เสื้อใส่เข้างาน', 
    price: 700,
    description: 'เสื้อเจอร์ซีย์แขนสั้น Tiger Thailand',
    images: [design2Front, design2Back]
  },
  { 
    id: '3', 
    name: 'แบบที่ 3 เสื้อใส่เข้างาน แพคคู่', 
    price: 1100,
    description: 'เสื้อเจอร์ซีย์แขนยาวและแขนสั้น Tiger Thailand (ไซส์เดียวกัน)',
    images: [design3Front, design3Back]
  },
  { 
    id: '4', 
    name: 'แบบที่ 4 เสื้อยืดที่ระลึก', 
    price: 500,
    description: 'เสื้อยืด premium cotton',
    images: [design4Front, design4Back]
  }
];

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;