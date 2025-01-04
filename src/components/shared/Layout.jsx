import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen w-full relative">
            <div className="pattern-diagonal-lines pattern-teal-500 pattern-bg-white pattern-size-4 pattern-opacity-40 absolute inset-0"></div>
            <div className="flex-1 relative z-10 flex flex-col">
                <Header />
                <div className="flex-1">
                    <Outlet />
                </div>
                <Footer />
            </div>
        </div>
    );
}
