import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Step1Algorithm from './pages/Step1Algorithm';
import Step2Rules from './pages/Step2Rules';
import Step3Deduction from './pages/Step3Deduction';
import Step4BidInput from './pages/Step4BidInput';
import { useConfigStore } from './stores/configStore';

function NotFound() {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-full bg-[#C43A31]/10 flex items-center justify-center mx-auto mb-4">
        <i className="ri-compass-3-line text-3xl text-[#C43A31]"></i>
      </div>
      <h2 className="text-[22px] sm:text-[28px] font-semibold text-text dark:text-dark-text">页面不存在</h2>
      <p className="text-text-secondary dark:text-dark-text-secondary text-sm mt-2">请检查链接是否正确</p>
      <button onClick={() => window.location.href = '/algorithm'} className="btn-primary mt-6">
        <i className="ri-home-line"></i>
        <span>返回首页</span>
      </button>
    </div>
  );
}

export default function App() {
  const { theme } = useConfigStore();
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/algorithm" replace />} />
            <Route path="/algorithm" element={<Step1Algorithm />} />
            <Route path="/rules" element={<Step2Rules />} />
            <Route path="/deduction" element={<Step3Deduction />} />
            <Route path="/bids" element={<Step4BidInput />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}