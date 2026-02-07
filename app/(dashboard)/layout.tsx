import React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen metis-gradient flex text-slate-800 font-secondary relative overflow-x-hidden">
            {/* Sidebar Container */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-20 md:ml-24 relative">
                {/* Decorative Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#BBDDFF]/25 rounded-full blur-[140px] pointer-events-none z-0" />
                <div className="absolute bottom-[0%] right-[-5%] w-[55%] h-[55%] bg-[#C6DFFF]/30 rounded-full blur-[120px] pointer-events-none z-0" />
                <div className="absolute top-[20%] right-[15%] w-[40%] h-[40%] bg-[#DCE6FF]/25 rounded-full blur-[110px] pointer-events-none z-0" />
                <div className="absolute bottom-[15%] left-[10%] w-[35%] h-[35%] bg-[#D0E1FF]/20 rounded-full blur-[90px] pointer-events-none z-0" />

                <main className="flex flex-col p-4 md:p-8 gap-8 relative z-10 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
