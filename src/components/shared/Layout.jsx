import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen w-screen relative">
      {/* Background pattern, behind everything */}
      <div className="pattern-diagonal-lines pattern-teal-500 pattern-bg-white pattern-size-4 pattern-opacity-40 absolute inset-0 z-0"></div>

      {/* Header (ensure it's always on top) */}
      <Header className="z-20" />

      <div className="flex-1 relative z-10 overflow-y-auto">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
