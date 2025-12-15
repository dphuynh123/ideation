import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MindMapPage from './pages/MindMapPage';

const App: React.FC = () => {
  return (
    <BrowserRouter basename='/ideation'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mindmap" element={<MindMapPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;