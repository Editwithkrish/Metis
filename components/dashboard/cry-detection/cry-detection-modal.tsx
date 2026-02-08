"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarVisualizer } from "@/components/ui/bar-visualizer";
import { Matrix } from "@/components/ui/matrix";
import { Baby, Zap, Play, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CryDetectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type DetectionStep = "idle" | "listening" | "analyzing" | "result";

export function CryDetectionModal({ isOpen, onClose }: CryDetectionModalProps) {
    const [step, setStep] = useState<DetectionStep>("idle");
    const [countdown, setCountdown] = useState(7);
    const [result, setResult] = useState<{ reason: string; confidence: number; advice: string } | null>(null);

    const startDetection = () => {
        setStep("listening");
        setCountdown(7);

        // Timer for the 7-second capture
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Transition to analyzing after 7 seconds
        setTimeout(() => {
            setStep("analyzing");
            // Process for 4 seconds
            setTimeout(() => {
                setResult({
                    reason: "Hungry",
                    confidence: 96,
                    advice: "Leo's cry pattern matches the 'Neh' sound, typically associated with the hunger reflex. It's likely time for a feeding session."
                });
                setStep("result");
            }, 4000);
        }, 7000);
    };

    const reset = () => {
        setStep("idle");
        setCountdown(7);
        setResult(null);
    };

    useEffect(() => {
        if (isOpen) reset();
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-full md:max-w-[500px] w-[calc(100%-2rem)] p-0 overflow-hidden border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] rounded-[40px] font-secondary z-[100]"
            >
                <div className="relative flex flex-col items-center p-8 md:p-12 min-h-[520px]">
                    {/* Brand Header */}
                    <div className="w-full text-center mb-8">
                        <DialogHeader>
                            <DialogTitle className="text-4xl font-normal text-slate-900 tracking-tight font-primary italic">Cry Decoder</DialogTitle>
                            <DialogDescription className="text-slate-500 text-sm font-medium mt-1">AI & ML powered neonatal analysis</DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* Dynamic Content Area */}
                    <div className="flex-1 flex flex-col items-center justify-center w-full">
                        <AnimatePresence mode="wait">
                            {step === "idle" && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-center space-y-8 w-full flex flex-col items-center"
                                >
                                    <div className="w-28 h-28 rounded-full bg-primary/5 flex items-center justify-center relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                            transition={{ repeat: Infinity, duration: 3 }}
                                            className="absolute inset-0 bg-primary/20 rounded-full"
                                        />
                                        <Baby size={48} className="text-primary relative z-10" />
                                    </div>
                                    <div className="space-y-6 w-full flex flex-col items-center">
                                        <p className="text-slate-600 text-[15px] font-medium max-w-[320px] leading-relaxed">
                                            Keep your phone near Leo. Hestia will capture a 7-second audio sample to decode his needs.
                                        </p>
                                        <Button
                                            onClick={startDetection}
                                            className="h-14 px-12 rounded-[22px] bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-[0.25em] shadow-2xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-98 flex items-center gap-3 cursor-pointer"
                                        >
                                            <Play size={16} fill="white" /> Start Decoder
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {step === "listening" && (
                                <motion.div
                                    key="listening"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center space-y-12 w-full"
                                >
                                    <div className="w-full flex items-center justify-center py-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 px-8">
                                        <BarVisualizer className="w-full" barCount={18} state="listening" />
                                    </div>
                                    <div className="text-center space-y-3">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-primary">
                                                Recording Capture ({countdown}s)
                                            </p>
                                        </div>
                                        <p className="text-slate-400 text-xs font-medium italic">
                                            Ensuring high-fidelity audio environment
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {step === "analyzing" && (
                                <motion.div
                                    key="analyzing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center space-y-10 w-full"
                                >
                                    <Matrix rows={7} cols={10} color="#5C7CFA" />
                                    <div className="text-center space-y-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="animate-spin text-primary" size={16} />
                                            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-primary">
                                                ML Processing...
                                            </p>
                                        </div>
                                        <p className="text-slate-400 text-xs font-medium italic">
                                            Matching patterns against 10k+ recordings
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {step === "result" && result && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full space-y-8"
                                >
                                    <div className="bg-slate-50 rounded-[32px] p-10 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden shadow-sm">
                                        <div className="absolute top-0 right-0 p-4">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                                                <Zap size={12} className="text-primary fill-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-wider text-primary">{result.confidence}% Match</span>
                                            </div>
                                        </div>

                                        <h4 className="text-5xl font-normal text-slate-900 font-primary mb-6 italic pt-4">
                                            {result.reason}
                                        </h4>

                                        <p className="text-slate-700 text-[15px] leading-relaxed font-secondary mt-2 border-l-4 border-primary/30 pl-6 py-2 bg-white/40 rounded-r-xl text-left italic">
                                            "{result.advice}"
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button
                                            variant="outline"
                                            onClick={reset}
                                            className="flex-1 h-12 rounded-2xl border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 cursor-pointer"
                                        >
                                            Retake
                                        </Button>
                                        <Button
                                            onClick={onClose}
                                            className="flex-1 h-12 rounded-2xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-200 cursor-pointer"
                                        >
                                            <Check size={16} className="mr-2" /> Finish
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
