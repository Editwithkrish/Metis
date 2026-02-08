"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Orb } from "@/components/ui/orb";
import {
    ArrowRight,
    ArrowLeft,
    Check,
    Baby,
    Calendar as CalendarIcon,
    Weight,
    Ruler,
    Heart
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 1 | 2 | 3 | 4;

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
    const [step, setStep] = useState<Step>(1);
    const [formData, setFormData] = useState({
        babyName: "",
        gender: "",
        dob: "",
        weight: "",
        weightUnit: "kg",
        height: "",
        heightUnit: "cm",
        conditions: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    // Load data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem("metis_onboarding_data");
        const savedStep = localStorage.getItem("metis_onboarding_step");

        if (savedData) {
            try {
                setFormData(JSON.parse(savedData));
            } catch (e) {
                console.error("Failed to parse saved onboarding data", e);
            }
        }

        if (savedStep) {
            const stepNum = parseInt(savedStep);
            if (stepNum >= 1 && stepNum <= 4) {
                setStep(stepNum as Step);
            }
        }
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("metis_onboarding_data", JSON.stringify(formData));
        localStorage.setItem("metis_onboarding_step", step.toString());
    }, [formData, step]);

    const nextStep = () => {
        if (isStepValid()) {
            setStep((prev) => (prev < 4 ? (prev + 1) as Step : prev));
        } else {
            toast.error("Please fill in all fields to continue");
        }
    };
    const prevStep = () => setStep((prev) => (prev > 1 ? (prev - 1) as Step : prev));

    const isStepValid = () => {
        switch (step) {
            case 1:
                return formData.babyName.trim() !== "" && formData.gender !== "";
            case 2:
                return formData.dob !== "";
            case 3:
                return formData.weight !== "" && formData.height !== "";
            case 4:
                return true; // Optional field
            default:
                return false;
        }
    };

    const handleComplete = async () => {
        try {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("No user found");

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    baby_name: formData.babyName,
                    gender: formData.gender,
                    dob: formData.dob,
                    initial_weight: formData.weight ? parseFloat(formData.weight) : null,
                    weight_unit: formData.weightUnit,
                    initial_height: formData.height ? parseFloat(formData.height) : null,
                    height_unit: formData.heightUnit,
                    medical_conditions: formData.conditions,
                    onboarding_completed: true
                });

            if (error) throw error;

            // Clear localStorage on success
            localStorage.removeItem("metis_onboarding_data");
            localStorage.removeItem("metis_onboarding_step");

            toast.success("Welcome to Metis! Profile created.");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to save profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const getAgentMessage = () => {
        switch (step) {
            case 1: return "Hello! I'm Hestia, your AI companion. Let's start by getting to know your little one. What's their name?";
            case 2: return `A beautiful name! And when did ${formData.babyName || 'the little one'} join the family?`;
            case 3: return "Great. Now, let's record some initial measurements for tracking growth trends.";
            case 4: return "Almost there! Is there anything specific like allergies or conditions I should keep an eye on?";
            default: return "";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            // Prevent closing if it's open and we haven't finished
            if (!open) return;
            onClose();
        }}>
            <DialogContent
                showCloseButton={false}
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="max-w-full md:max-w-[1000px] w-[calc(100%-2rem)] p-0 overflow-hidden border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] rounded-[32px] font-secondary"
            >
                <div className="flex flex-col md:flex-row min-h-[500px] md:h-[650px] relative">

                    {/* Left Section: AI Agent Interaction */}
                    <div className="w-full md:w-[38%] relative flex flex-col items-center justify-between p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/40 transition-all duration-500 overflow-hidden">
                        <div className="space-y-4 text-center w-full relative z-10">
                            <VisuallyHidden>
                                <DialogTitle>Onboarding with Hestia</DialogTitle>
                            </VisuallyHidden>
                            <h3 className="text-3xl font-normal text-slate-900 tracking-tight leading-tight font-primary flex items-center justify-center gap-3">
                                <img src="/logo.svg" alt="Metis" className="w-8 h-8" /> Meet Hestia
                            </h3>
                            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-slate-600 text-[13px] leading-relaxed font-medium">
                                    {getAgentMessage()}
                                </p>
                            </div>
                        </div>

                        {/* Animated Orb Component */}
                        <div className="flex-1 flex items-center justify-center w-full my-6 md:my-0">
                            <div className="aspect-square w-[180px] lg:w-[220px] relative transition-transform duration-700 hover:scale-105">
                                <Orb
                                    agentState="thinking"
                                    colors={["#1e40af", "#60a5fa"]}
                                    className="w-full h-full"
                                />
                            </div>
                        </div>

                        <div className="w-full flex flex-col items-center gap-4">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Step {step} of 4</p>
                        </div>
                    </div>

                    {/* Right Section: Multi-step Form */}
                    <div className="flex-1 bg-white p-8 md:p-14 relative flex flex-col justify-center overflow-y-auto no-scrollbar">
                        <div className="max-w-[440px] mx-auto w-full py-6">

                            {/* Step 1: Baby Name & Gender */}
                            {step === 1 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-normal text-slate-900 tracking-tight leading-tight font-primary">Basics</h2>
                                        <p className="text-slate-400 text-sm font-medium">Let's start with the very basics.</p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Baby's Full Name</Label>
                                            <div className="relative group">
                                                <Baby className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                                <Input
                                                    placeholder="e.g. Leo Alexander"
                                                    value={formData.babyName}
                                                    onChange={(e) => handleInputChange("babyName", e.target.value)}
                                                    className="h-14 bg-slate-50 border-slate-100 rounded-xl pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white transition-all shadow-none border-2 focus:border-primary/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Gender</Label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {['Boy', 'Girl', 'Other'].map((g) => (
                                                    <button
                                                        key={g}
                                                        type="button"
                                                        onClick={() => handleInputChange("gender", g)}
                                                        className={`h-12 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border-2 ${formData.gender === g ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-50 hover:border-slate-200'}`}
                                                    >
                                                        {g}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Date of Birth */}
                            {step === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-normal text-slate-900 tracking-tight leading-tight font-primary">Important Date</h2>
                                        <p className="text-slate-400 text-sm font-medium">We'll use this for developmental milestones.</p>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Date of Birth</Label>
                                        <div className="relative group">
                                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                                            <Input
                                                type="date"
                                                value={formData.dob}
                                                onChange={(e) => handleInputChange("dob", e.target.value)}
                                                className="h-14 bg-slate-50 border-slate-100 rounded-xl pl-12 pr-4 text-sm text-slate-900 [color-scheme:light] transition-all shadow-none border-2 focus:border-primary/20"
                                            />
                                        </div>
                                        <p className="text-[11px] text-slate-400 px-1 italic">Note: This helps Hestia provide age-appropriate advice.</p>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Weight & Height */}
                            {step === 3 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-normal text-slate-900 tracking-tight leading-tight font-primary">Measurements</h2>
                                        <p className="text-slate-400 text-sm font-medium">Current weight and height at time of setup.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Weight ({formData.weightUnit})</Label>
                                            <div className="relative group">
                                                <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                                <Input
                                                    type="number"
                                                    placeholder="0.0"
                                                    value={formData.weight}
                                                    onChange={(e) => handleInputChange("weight", e.target.value)}
                                                    className="h-14 bg-slate-50 border-slate-100 rounded-xl pl-12 pr-4 text-sm text-slate-900 transition-all shadow-none border-2 focus:border-primary/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Height ({formData.heightUnit})</Label>
                                            <div className="relative group">
                                                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={formData.height}
                                                    onChange={(e) => handleInputChange("height", e.target.value)}
                                                    className="h-14 bg-slate-50 border-slate-100 rounded-xl pl-12 pr-4 text-sm text-slate-900 transition-all shadow-none border-2 focus:border-primary/20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Final Questions */}
                            {step === 4 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-normal text-slate-900 tracking-tight leading-tight font-primary">Final Details</h2>
                                        <p className="text-slate-400 text-sm font-medium">Anything else worth mentioning?</p>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Allergies or Conditions</Label>
                                        <textarea
                                            placeholder="e.g. Milk allergy, G6PD deficiency..."
                                            value={formData.conditions}
                                            onChange={(e) => handleInputChange("conditions", e.target.value)}
                                            className="w-full min-h-[140px] bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white transition-all shadow-none focus:border-primary/20 outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex items-center gap-4 mt-12 pt-6 border-t border-slate-100">
                                {step > 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={prevStep}
                                        className="h-14 flex-1 rounded-2xl border-2 border-slate-100 text-slate-600 font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all gap-2"
                                    >
                                        <ArrowLeft size={16} /> Back
                                    </Button>
                                )}
                                <Button
                                    disabled={isLoading || !isStepValid()}
                                    onClick={step === 4 ? handleComplete : nextStep}
                                    className="h-14 flex-[2] rounded-2xl bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-[0.3em] shadow-xl hover:translate-y-[-2px] transition-all gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        "Saving..."
                                    ) : step === 4 ? (
                                        <>Complete Setup <Check size={16} /></>
                                    ) : (
                                        <>Next Step <ArrowRight size={16} /></>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
