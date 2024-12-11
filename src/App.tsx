// src/App.tsx
import './App.css';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import ShirtOrderForm from '@/components/ShirtOrderForm';
import AdminDashboard from '@/components/AdminDashboard';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              ระบบสั่งจองเสื้อ
            </h1>
            <h2 className="text-xl font-semibold text-gray-700 mt-2">
              Tiger Thailand Meeting 2025
            </h2>
            
            {/* Important Notices */}
            <div className="space-y-2 mt-4">
              <p className="text-red-600">
                ** เสื้อสำหรับใส่เข้างาน คือ แบบที่ 1 และ แบบที่ 2 เท่านั้น **
              </p>
              <p className="text-orange-600">
                ** สั่งได้ตั้งแต่วันนี้ จนถึง 10 มกราคม 2568 **
              </p>
              <p className="text-gray-600">
                เลือกแบบและขนาดตามที่ต้องการ
              </p>
            </div>
            
            {/* Navigation */}
            <nav className="mt-6">
              <ul className="flex justify-center space-x-6">
                <li>
                  <Link 
                    to="/" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    หน้าสั่งซื้อ
                  </Link>
                </li>
                {/* Admin Link - Commented out for security
                <li>
                  <Link 
                    to="/admin" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    จัดการออเดอร์
                  </Link>
                </li>
                */}
              </ul>
            </nav>
          </header>
          
          {/* Main Content */}
          <main className="mb-8">
            <Routes>
              {/* Order Form Route */}
              <Route 
                path="/" 
                element={<ShirtOrderForm />} 
              />
              
              {/* Admin Dashboard Route */}
              <Route 
                path="/teadminorders" 
                element={<AdminDashboard />} 
              />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="text-center text-gray-500 text-sm mt-auto py-4">
            <div className="border-t pt-4">
              <p>&copy; 2024 ระบบสั่งจองเสื้อ. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;