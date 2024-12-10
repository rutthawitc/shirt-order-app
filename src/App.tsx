// src/App.tsx
import './App.css';
import ShirtOrderForm from '@/components/ShirtOrderForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ระบบสั่งจองเสื้อ</h1>
          <p className="text-gray-600 mt-2">เลือกแบบและขนาดตามที่ต้องการ</p>
        </header>
        
        <main>
          <ShirtOrderForm />
        </main>

        <footer className="text-center text-gray-500 text-sm mt-8">
          <p> 2024 ระบบสั่งจองเสื้อ. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;