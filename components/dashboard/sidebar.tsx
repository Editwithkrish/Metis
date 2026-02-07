"use client";

import React from "react";
import {
    LayoutDashboard,
    Calendar,
    MessageSquare,
    Stethoscope,
    BookOpen,
    HelpCircle
} from "lucide-react";

interface NavItemProps {
    icon: React.ReactNode;
    active?: boolean;
}

function NavItem({ icon, active = false }: NavItemProps) {
    return (
        <button className={`
      relative p-3 rounded-2xl transition-all duration-300 group cursor-pointer
      ${active
                ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                : "text-slate-400 hover:bg-white/60 hover:text-slate-900 hover:shadow-md"}
    `}>
            {icon}
            {active && (
                <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-slate-900 rounded-r-full" />
            )}
        </button>
    );
}

export function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen w-24 md:w-32 flex flex-col items-center py-8 gap-10 border-r border-white/20 z-50 backdrop-blur-md bg-white/5">
            <div className="text-primary font-bold text-2xl tracking-tight font-primary hover:scale-105 transition-transform cursor-pointer">
                Metis
            </div>

            <nav className="flex flex-col gap-6">
                <NavItem icon={<LayoutDashboard size={24} />} active />
                <NavItem icon={<Calendar size={24} />} />
                <NavItem icon={<MessageSquare size={24} />} />
                <NavItem icon={<Stethoscope size={24} />} />
                <NavItem icon={<BookOpen size={24} />} />
            </nav>

            <div className="mt-auto">
                <NavItem icon={<HelpCircle size={24} />} />
            </div>
        </aside>
    );
}
