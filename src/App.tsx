import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>首页重定向到 step-1</div>} />
        <Route path="/step-1" element={<div>Step 1 占位</div>} />
        <Route path="/step-2" element={<div>Step 2 占位</div>} />
        <Route path="/step-3" element={<div>Step 3 占位</div>} />
        <Route path="/step-4" element={<div>Step 4 占位</div>} />
        <Route path="/step-5" element={<div>Step 5 占位</div>} />
      </Routes>
    </BrowserRouter>
  );
}
