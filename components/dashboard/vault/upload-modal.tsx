"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Upload,
    X,
    FileText,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    CloudUpload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
    const [step, setStep] = useState<"idle" | "uploading" | "success">("idle");
    const [dragActive, setDragActive] = useState(false);

    const handleUpload = () => {
        setStep("uploading");
        setTimeout(() => {
            setStep("success");
        }, 2500);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-full md:max-w-[500px] w-[calc(100%-2rem)] p-0 overflow-hidden border-none bg-white shadow-2xl rounded-[32px] font-secondary">
                <div className="relative p-8 md:p-10">
                    <DialogHeader className="text-center mb-8">
                        <DialogTitle className="text-3xl font-normal text-slate-900 font-primary">Upload Document</DialogTitle>
                        <DialogDescription className="text-slate-500 text-sm font-medium mt-1">
                            Add a new document to Leo's secure vault
                        </DialogDescription>
                    </DialogHeader>

                    <AnimatePresence mode="wait">
                        {step === "idle" && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    className={`relative group border-2 border-dashed rounded-[24px] p-10 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${dragActive
                                            ? "border-primary bg-primary/5 scale-[1.02]"
                                            : "border-slate-200 hover:border-primary/50 hover:bg-slate-50/50"
                                        }`}
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                        <CloudUpload size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-slate-900">Drop your file here</p>
                                        <p className="text-xs text-slate-500 font-medium">PDF, JPG, or PNG up to 10MB</p>
                                    </div>
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>

                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="doc-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Document Name</Label>
                                        <Input id="doc-name" placeholder="e.g. Vaccination Record Feb 2026" className="h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {["Medical", "Identity", "Vaccine", "Other"].map(cat => (
                                                <button key={cat} className="px-4 py-2 rounded-full bg-slate-100 hover:bg-primary/10 hover:text-primary text-[10px] font-bold text-slate-500 transition-colors">
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleUpload}
                                    className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px] active:scale-95"
                                >
                                    Start Upload
                                </Button>

                                <div className="flex items-center justify-center gap-2 pt-2 text-emerald-600">
                                    <ShieldCheck size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Secure E2E Encryption</span>
                                </div>
                            </motion.div>
                        )}

                        {step === "uploading" && (
                            <motion.div
                                key="uploading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-12 flex flex-col items-center justify-center space-y-8"
                            >
                                <div className="relative">
                                    <Loader2 className="w-20 h-20 text-primary animate-spin opacity-20" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Upload className="text-primary animate-bounce" size={24} />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-lg font-bold text-slate-900">Uploading Document...</p>
                                    <p className="text-xs text-slate-500 font-medium">Encrypting and securing Leo's data</p>
                                </div>
                            </motion.div>
                        )}

                        {step === "success" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 flex flex-col items-center justify-center space-y-8"
                            >
                                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-100/50">
                                    <CheckCircle2 size={48} />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-2xl font-bold text-slate-900 font-primary">Upload Complete!</p>
                                    <p className="text-sm text-slate-500 font-medium max-w-[250px]">
                                        Your document has been safely stored in the vault.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => {
                                        setStep("idle");
                                        onClose();
                                    }}
                                    className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200"
                                >
                                    Back to Vault
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
