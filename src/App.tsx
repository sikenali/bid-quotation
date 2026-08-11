import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Step1Algorithm from './pages/Step1Algorithm';
import Step2Rules from './pages/Step2Rules';
import Step3Deduction from './pages/Step3Deduction';
import Step4BidInput from './pages/Step4BidInput';
import Step5Results from './pages/Step5Results';
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
          <Route path="/" element={<Navigate to="/step-1" replace />} />
          <Route path="/step-1" element={<Step1Algorithm />} />
          <Route path="/step-2" element={<Step2Rules />} />
          <Route path="/step-3" element={<Step3Deduction />} />
          <Route path="/step-4" element={<Step4BidInput />} />
          <Route path="/step-5" element={<Step5Results />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
