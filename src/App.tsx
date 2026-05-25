import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/other" element={<div className="text-center text-xl">功能开发中...</div>} />
    </Routes>
  );
}
