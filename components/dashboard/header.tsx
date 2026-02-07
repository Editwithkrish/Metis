import React from "react";
import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardHeaderProps {
    title: string;
    subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
    return (
        <header className="grid grid-cols-3 items-center gap-4 h-16 w-full">
            {/* Title Section */}
            <div className="flex flex-col justify-center">
                <h1 className="text-3xl font-normal tracking-tight text-slate-900/90 font-primary">
                    {title}
                </h1>
                {subtitle && <p className="text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis text-xs mt-0.5 font-secondary">{subtitle}</p>}
            </div>

            {/* Search Section - Guaranteed Center */}
            <div className="flex justify-center hidden md:flex font-secondary">
                <div className="relative group w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="search"
                        placeholder="Search metrics, consultations..."
                        className="w-full h-12 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 text-sm"
                    />
                </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-4 justify-self-end">
                <button
                    aria-label="Notifications"
                    className="p-2.5 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 text-slate-600 hover:bg-white/60 transition-colors relative cursor-pointer"
                >
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-400 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white/60 shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                        <AvatarImage
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                            alt="User profile"
                        />
                        <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-sm cursor-default font-secondary">
                        <p className="font-bold text-slate-900/80 leading-none">Sarah Wilson</p>
                        <p className="text-slate-500 text-[10px] mt-1 font-bold uppercase tracking-wider">Mom of baby Leo</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
