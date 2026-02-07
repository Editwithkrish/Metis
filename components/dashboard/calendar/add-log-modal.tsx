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
import { Textarea } from "@/components/ui/textarea";
import { Orb } from "@/components/ui/orb";
import { ImagePlus, Calendar as CalendarIcon, Send } from "lucide-react";

interface AddLogModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddLogModal({ isOpen, onClose }: AddLogModalProps) {
    const [status, setStatus] = useState<'upcoming' | 'completed'>('upcoming');
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const toggleVoice = () => {
        const nextState = !isVoiceEnabled;
        setIsVoiceEnabled(nextState);
        setIsListening(nextState);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                showCloseButton
                className="max-w-full md:max-w-[1000px] w-[calc(100%-2rem)] p-0 overflow-hidden border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] rounded-[32px] font-sans"
            >
                <style jsx global>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>

                <div className="flex flex-col md:flex-row min-h-[500px] md:h-[650px] relative">

                    {/* Left Section: Voice Interaction */}
                    <div
                        onClick={toggleVoice}
                        className="w-full md:w-[38%] relative flex flex-col items-center justify-between p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/40 transition-all duration-500 group overflow-hidden cursor-pointer hover:bg-slate-100/80"
                    >
                        <div className="space-y-3 text-center w-full relative z-10 transition-all duration-500">
                            <h3 className="text-3xl font-light text-slate-900 tracking-tight leading-tight">Talk to Hestia</h3>
                            <p className="text-slate-500 text-xs leading-relaxed max-w-[240px] mx-auto italic font-medium opacity-80">
                                {isVoiceEnabled ? '"Add a growth milestone: Leo started crawling today"' : "Click to wake up Hestia and start speaking"}
                            </p>
                        </div>

                        {/* Orb or Passive Logo Container */}
                        <div className="flex-1 flex items-center justify-center w-full my-6 md:my-0">
                            {!isVoiceEnabled ? (
                                <div className="aspect-square w-[180px] lg:w-[220px] rounded-full bg-white/50 border border-slate-200/60 shadow-inner flex items-center justify-center transition-all duration-700 group-hover:scale-105 group-hover:shadow-md">
                                    <img
                                        src="/logo.svg"
                                        alt="Hestia Logo"
                                        className="w-16 h-16 grayscale opacity-20 group-hover:opacity-40 transition-all duration-500"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-square w-[180px] lg:w-[220px] relative transition-transform duration-700 hover:scale-105">
                                    <Orb
                                        agentState={isListening ? "listening" : "thinking"}
                                        colors={["#1e40af", "#60a5fa"]}
                                        className="w-full h-full"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="w-full h-16 flex flex-col items-center justify-center gap-2">
                            <p className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-500 ${isVoiceEnabled ? 'text-primary/60 animate-pulse' : 'text-slate-400'}`}>
                                {isVoiceEnabled ? "Hestia is listening..." : "Tap to speak"}
                            </p>
                            {!isVoiceEnabled && (
                                <div className="h-[1px] w-8 bg-slate-200" />
                            )}
                        </div>
                    </div>

                    {/* Right Section: Form Experience */}
                    <div className="flex-1 bg-white p-8 md:p-14 no-scrollbar relative flex flex-col justify-center">
                        <div className="max-w-[500px] mx-auto w-full">
                            <DialogHeader className="mb-10 text-left">
                                <DialogTitle className="text-3xl font-light text-slate-900 tracking-tight leading-tight">Activity Log</DialogTitle>
                                <DialogDescription className="text-slate-400 text-sm font-medium mt-1">Capture a new milestone or health record.</DialogDescription>
                            </DialogHeader>

                            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onClose(); }}>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-3">
                                        <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Visual Capture</Label>
                                        <div className="group relative h-24 rounded-2xl bg-slate-50/80 border-2 border-dashed border-slate-100 hover:border-primary/40 hover:bg-slate-100/50 transition-all duration-500 flex items-center justify-center gap-3 cursor-pointer overflow-hidden">
                                            <ImagePlus size={20} className="text-slate-400 group-hover:text-primary transition-all" />
                                            <span className="text-[10px] text-slate-400 group-hover:text-slate-600 font-bold uppercase tracking-[0.1em]">Attach Image</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Activity Name</Label>
                                        <Input
                                            placeholder="What happened today?"
                                            className="h-12 bg-slate-50/50 border-slate-100 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white transition-all px-4 shadow-none"
                                        />
                                        <p className="text-[10px] text-slate-400 italic">E.g. Vaccination, First Steps...</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Status</Label>
                                        <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-100 h-12 items-center">
                                            <button
                                                type="button"
                                                onClick={() => setStatus('upcoming')}
                                                className={`flex-1 flex items-center justify-center h-full rounded-lg text-[11px] font-bold transition-all ${status === 'upcoming' ? 'bg-white text-slate-900 shadow-sm border border-slate-100/50' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                Upcoming
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setStatus('completed')}
                                                className={`flex-1 flex items-center justify-center h-full rounded-lg text-[11px] font-bold transition-all ${status === 'completed' ? 'bg-white text-slate-900 shadow-sm border border-slate-100/50' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                Done
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Date</Label>
                                        <div className="relative group h-12">
                                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" size={16} />
                                            <Input
                                                type="date"
                                                className="h-full bg-slate-50/50 border-slate-100 rounded-xl pl-11 pr-4 text-xs text-slate-900 transition-all [color-scheme:light]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Notes & Observations</Label>
                                    <Textarea
                                        placeholder="Add heartful details about this moment..."
                                        className="bg-slate-50/50 border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 min-h-[90px] focus:bg-white resize-none px-5 py-4 text-sm leading-relaxed transition-all"
                                    />
                                </div>

                                <div className="pt-4 mt-2">
                                    <Button
                                        className="h-12 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-[0.3em] transition-all hover:translate-y-[-1px] active:translate-y-[1px] shadow-lg shadow-slate-200 flex items-center justify-center gap-3 border-none"
                                    >
                                        Log Activity <Send size={16} />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
