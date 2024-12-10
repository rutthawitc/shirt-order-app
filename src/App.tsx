// src/App.tsx
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ShirtOrderForm from '@/components/ShirtOrderForm';
import AdminDashboard from '@/components/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">ระบบสั่งจองเสื้อ</h1>
            <p className="text-gray-600 mt-2">เลือกแบบและขนาดตามที่ต้องการ</p>
            <nav className="mt-4">
              <ul className="flex justify-center space-x-4">
                <li>
                  <Link 
                    to="/" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    หน้าสั่งซื้อ
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    จัดการออเดอร์
                  </Link>
                </li>
              </ul>
            </nav>
          </header>
          
          <main>
            <Routes>
              <Route path="/" element={<ShirtOrderForm />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>

          <footer className="text-center text-gray-500 text-sm mt-8">
            <p> 2024 ระบบสั่งจองเสื้อ. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;