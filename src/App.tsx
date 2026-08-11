import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Step1Algorithm from './pages/Step1Algorithm';
import Step4BidInput from './pages/Step4BidInput';
import Step5Results from './pages/Step5Results';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/step-1" replace />} />
          <Route path="/step-1" element={<Step1Algorithm />} />
          <Route path="/step-2" element={<div>Step 2 占位</div>} />
          <Route path="/step-3" element={<div>Step 3 占位</div>} />
          <Route path="/step-4" element={<Step4BidInput />} />
          <Route path="/step-5" element={<Step5Results />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
