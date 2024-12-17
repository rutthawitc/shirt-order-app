// src/App.tsx
import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    window.location.href = 'https://tt-meeting-shirt.vercel.app/';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-lg">กำลังนำคุณไปยังระบบใหม่...</p>
        <p className="mt-2">
          หากไม่ถูกนำไปโดยอัตโนมัติ กรุณา
          <a 
            href="https://tt-meeting-shirt.vercel.app/" 
            className="text-blue-600 hover:text-blue-800 underline ml-1"
          >
            คลิกที่นี่
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;