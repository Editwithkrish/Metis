"use client";

import React, { useState } from "react";
import {
    Search,
    Plus,
    FileText,
    ShieldCheck,
    MoreVertical,
    Download,
    Trash2,
    Share2,
    Filter,
    FolderPlus,
    FileCode,
    FileImage
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { UploadModal } from "@/components/dashboard/vault/upload-modal";

const documentCategories = [
    { id: "all", label: "All Docs", icon: <FileText size={18} />, count: 12 },
    { id: "medical", label: "Medical", icon: <ShieldCheck size={18} />, count: 5 },
    { id: "identity", label: "Identity", icon: <FileCode size={18} />, count: 2 },
    { id: "vaccine", label: "Vaccines", icon: <FileImage size={18} />, count: 5 },
];

const documents = [
    {
        id: "1",
        name: "Birth Certificate - Leo.pdf",
        category: "Identity",
        date: "Jan 15, 2026",
        size: "1.2 MB",
        type: "pdf",
        isVerified: true,
        issuer: "Gov. Health Registry"
    },
    {
        id: "2",
        name: "DPT Vaccination Report.pdf",
        category: "Vaccines",
        date: "Feb 02, 2026",
        size: "840 KB",
        type: "pdf",
        isVerified: true,
        issuer: "St. Mary Children's Hospital"
    },
    {
        id: "3",
        name: "Monthly Growth Summary.doc",
        category: "Medical",
        date: "Feb 05, 2026",
        size: "2.1 MB",
        type: "doc",
        isVerified: false
    },
    {
        id: "4",
        name: "Leo Prescription - Fever.jpg",
        category: "Medical",
        date: "Jan 28, 2026",
        size: "3.5 MB",
        type: "image",
        isVerified: true,
        issuer: "Dr. Sarah Wilson"
    },
    {
        id: "5",
        name: "Polio Vaccine Cert.pdf",
        category: "Vaccines",
        date: "Jan 10, 2026",
        size: "720 KB",
        type: "pdf",
        isVerified: true,
        issuer: "Global Health Org"
    }
];

export default function VaultPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-8">
            <DashboardHeader
                title="Medical Vault"
                subtitle="Secure storage for Leo's vital documents"
            />

            <div className="flex flex-col md:flex-row gap-6 items-center justify-between z-20">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Search for certificates, reports..."
                        className="pl-12 h-12 bg-white/60 backdrop-blur-xl border-white/60 rounded-2xl shadow-sm focus:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-white/60 bg-white/40 backdrop-blur-md font-bold text-xs uppercase tracking-widest text-slate-600 gap-2">
                        <Filter size={16} /> Filter
                    </Button>
                    <Button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="h-12 px-8 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200 gap-2 flex-1 md:flex-none cursor-pointer hover:bg-slate-800 transition-all active:scale-95"
                    >
                        <Plus size={18} /> Upload New
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-secondary">
                {/* Left Side: Categories */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex flex-col gap-2">
                        {documentCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center justify-between p-4 rounded-[20px] transition-all cursor-pointer ${selectedCategory === cat.id
                                    ? "bg-slate-900 text-white shadow-xl scale-[1.02]"
                                    : "bg-white/40 hover:bg-white/60 text-slate-600"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {cat.icon}
                                    <span className="font-bold text-sm tracking-tight">{cat.label}</span>
                                </div>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${selectedCategory === cat.id ? "bg-white/20" : "bg-slate-100"
                                    }`}>
                                    {cat.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <Card className="glass border-none shadow-xl overflow-hidden group">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto group-hover:scale-110 transition-transform">
                                <ShieldCheck size={24} />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-sm text-slate-900">E2E Encrypted</p>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                    Your data is secured with AES-256 military grade encryption.
                                </p>
                            </div>
                            <Button variant="link" className="text-emerald-600 text-[10px] font-black uppercase tracking-widest p-0">
                                View Security Audit
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Document List */}
                <div className="lg:col-span-9">
                    <div className="space-y-4">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="glass hover:bg-white/60 transition-all p-5 rounded-[24px] border-none shadow-md group cursor-pointer flex items-center gap-5"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                                    <FileText size={28} />
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-900 text-base truncate group-hover:text-primary transition-colors">
                                            {doc.name}
                                        </h4>
                                        {doc.isVerified && (
                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100/50">
                                                <ShieldCheck size={10} className="fill-emerald-600/10" />
                                                <span className="text-[9px] font-black uppercase tracking-tighter">Verified</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold text-[9px] uppercase tracking-wider px-2">
                                            {doc.category}
                                        </Badge>
                                        <span className="text-[11px] font-medium text-slate-400">
                                            {doc.issuer ? `${doc.issuer} • ` : ""}{doc.date}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2.5 rounded-xl hover:bg-white text-slate-400 hover:text-slate-900 transition-all cursor-pointer">
                                        <Download size={18} />
                                    </button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2.5 rounded-xl hover:bg-white text-slate-400 hover:text-slate-900 transition-all cursor-pointer">
                                                <MoreVertical size={18} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl p-2 border-white/60 bg-white/90 backdrop-blur-xl">
                                            <DropdownMenuItem className="rounded-xl gap-3 font-bold text-xs text-slate-600 py-2.5 cursor-pointer focus:bg-primary/5 focus:text-primary">
                                                <Share2 size={16} /> Share Securely
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-xl gap-3 font-bold text-xs text-slate-600 py-2.5 cursor-pointer focus:bg-primary/5 focus:text-primary">
                                                <FolderPlus size={16} /> Move to Lab
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-xl gap-3 font-bold text-xs text-red-500 py-2.5 cursor-pointer focus:bg-red-50">
                                                <Trash2 size={16} /> Delete Forever
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Button variant="ghost" className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] hover:text-primary transition-colors cursor-pointer">
                            Load More Documents
                        </Button>
                    </div>
                </div>
            </div>
            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </div>
    );
}
