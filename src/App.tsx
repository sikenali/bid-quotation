import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Step1Algorithm from './pages/Step1Algorithm';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/step-1" replace />} />
          <Route path="/step-1" element={<Step1Algorithm />} />
          <Route path="/step-2" element={<div>Step 2 占位</div>} />
          <Route path="/step-3" element={<div>Step 3 占位</div>} />
          <Route path="/step-4" element={<div>Step 4 占位</div>} />
          <Route path="/step-5" element={<div>Step 5 占位</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
