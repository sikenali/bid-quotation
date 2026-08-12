import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Step1Algorithm from './pages/Step1Algorithm';
import Step2Rules from './pages/Step2Rules';
import Step3Deduction from './pages/Step3Deduction';
import Step4BidInput from './pages/Step4BidInput';
import { useConfigStore } from './stores/configStore';

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
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/algorithm" replace />} />
          <Route path="/algorithm" element={<Step1Algorithm />} />
          <Route path="/rules" element={<Step2Rules />} />
          <Route path="/deduction" element={<Step3Deduction />} />
          <Route path="/bids" element={<Step4BidInput />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
