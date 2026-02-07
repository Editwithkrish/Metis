"use client";

import React, { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    Syringe,
    Baby,
    Stethoscope,
    Plus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddLogModal } from "./add-log-modal";

interface BabyEvent {
    id: string;
    title: string;
    date: string;
    time?: string;
    type: 'vaccination' | 'checkup' | 'milestone';
    status: 'upcoming' | 'completed';
    description?: string;
}

const babyEvents: BabyEvent[] = [
    { id: "1", title: "DPT Booster 1", date: "2026-02-12", time: "10:30 AM", type: "vaccination", status: "upcoming", description: "6 Month Milestone Immunization" },
    { id: "2", title: "Monthly Growth Check", date: "2026-02-15", time: "09:00 AM", type: "checkup", status: "upcoming", description: "Dr. Emily Carter - Pediatrician" },
    { id: "3", title: "First Solid Food", date: "2026-01-20", type: "milestone", status: "completed", description: "Leo tried mashed carrots today!" },
    { id: "4", title: "Polio Vaccine (OPV)", date: "2026-01-15", type: "vaccination", status: "completed", description: "Oral drops administered" },
    { id: "5", title: "Hepatitis B - Dose 2", date: "2025-12-15", type: "vaccination", status: "completed" },
];

export function CalendarView() {
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Feb 2026
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    const year = currentMonth.getFullYear();

    const totalDays = daysInMonth(currentMonth.getMonth(), year);
    const startDay = firstDayOfMonth(currentMonth.getMonth(), year);

    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
    const paddingArray = Array.from({ length: startDay }, (_, i) => null);

    const getEventsForDay = (day: number) => {
        const dateStr = `${year}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return babyEvents.filter(e => e.date === dateStr);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full font-secondary">
            {/* Left Column: Date Grid */}
            <div className="lg:col-span-8 space-y-6">
                <Card className="glass border-none shadow-2xl p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-3xl font-medium text-slate-900/80 font-primary italic">
                                {monthName} <span className="opacity-40">{year}</span>
                            </h3>
                            <p className="text-slate-500 font-medium text-xs mt-1">Tracking Leo's first year</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-white/40 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-slate-900 border border-white/20">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="p-2 hover:bg-white/40 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-slate-900 border border-white/20">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 rounded-2xl overflow-hidden border-l border-t border-slate-200 bg-white/5">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="h-12 flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/30 border-r border-b border-slate-200">
                                {day}
                            </div>
                        ))}
                        {paddingArray.map((_, i) => (
                            <div key={`pad-${i}`} className="h-32 md:h-40 bg-white/5 border-r border-b border-slate-200" />
                        ))}
                        {daysArray.map(day => {
                            const events = getEventsForDay(day);
                            const isToday = day === 8; // Mock for current day
                            const isBooked = events.length > 0;

                            return (
                                <div key={day} className={`
                                    h-32 md:h-40 p-3 border-r border-b border-slate-200 relative transition-all
                                    ${isToday ? 'bg-primary/5' : 'bg-white/10'}
                                    ${isBooked ? 'bg-white/20' : ''}
                                `}>
                                    {/* Diagonal Stripe Pattern for "Booked" cells */}
                                    {isBooked && (
                                        <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_15px,#000_15px,#000_16px)]"></div>
                                    )}

                                    <div className="flex justify-between items-start relative z-10">
                                        <span className={`text-sm font-bold ${isToday ? 'text-primary' : 'text-slate-600'} ${isToday ? 'bg-primary/10 w-8 h-8 flex items-center justify-center rounded-full' : ''}`}>
                                            {day}
                                        </span>
                                    </div>

                                    <div className="mt-3 space-y-1 relative z-10">
                                        {events.map(event => (
                                            <div key={event.id} className={`
                                                px-2.5 py-1.5 rounded-full text-[10px] font-bold border truncate relative
                                                ${event.type === 'vaccination' ? 'bg-amber-100/80 text-amber-800 border-amber-200' :
                                                    event.type === 'checkup' ? 'bg-blue-100/80 text-blue-800 border-blue-200' :
                                                        'bg-emerald-100/80 text-emerald-800 border-emerald-200'}
                                            `}>
                                                <span className="relative z-10 leading-none">{event.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* Right Column: Unified Event Logs Card */}
            <div className="lg:col-span-4 h-full">
                <UnifiedLogsCard events={babyEvents} onAddClick={() => setIsAddModalOpen(true)} />
            </div>

            <AddLogModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}

function UnifiedLogsCard({ events, onAddClick }: { events: BabyEvent[], onAddClick: () => void }) {
    const [view, setView] = useState<'upcoming' | 'recent'>('upcoming');

    const filteredEvents = events.filter(e =>
        view === 'upcoming' ? e.status === 'upcoming' : e.status === 'completed'
    );

    return (
        <Card className="glass border-none shadow-xl flex flex-col h-full min-h-[600px]">
            <div className="p-6 border-b border-white/20 bg-white/20">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-medium text-xl text-slate-800 flex items-center gap-2 font-primary">
                        {view === 'upcoming' ? <Clock size={18} className="text-primary" /> : <CheckCircle2 size={18} className="text-emerald-500" />}
                        Activity Logs
                    </h3>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        onClick={onAddClick}
                    >
                        <Plus size={14} className="mr-1" /> Add New
                    </Button>
                </div>

                {/* View Toggle */}
                <div className="bg-white/30 p-1 rounded-xl border border-white/40 flex">
                    <button
                        onClick={() => setView('upcoming')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${view === 'upcoming' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setView('recent')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${view === 'recent' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Recent
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            dimmed={view === 'recent'}
                            showCheck={view === 'upcoming'}
                        />
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                        <CalendarIcon size={40} className="mb-3" />
                        <p className="font-bold text-sm">No {view} events</p>
                    </div>
                )}
            </div>
        </Card>
    );
}

function EventCard({ event, dimmed, showCheck }: { event: BabyEvent, dimmed?: boolean, showCheck?: boolean }) {
    const icons = {
        vaccination: <Syringe size={18} className="text-amber-500" />,
        checkup: <Stethoscope size={18} className="text-blue-500" />,
        milestone: <Baby size={18} className="text-emerald-500" />
    };

    return (
        <div className={`p-4 rounded-2xl border border-white/40 bg-white/30 transition-all hover:bg-white/50 group cursor-pointer relative overflow-hidden ${dimmed ? 'opacity-70 grayscale-[0.3]' : 'hover:shadow-md hover:scale-[1.01]'}`}>
            {/* Diagonal Stripe Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(-45deg,transparent,transparent_15px,#000_15px,#000_16px)]"></div>

            <div className="flex items-center gap-4 relative z-10">
                {/* Complete Action for Upcoming - Moved to Left */}
                {showCheck && (
                    <button
                        className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center text-transparent hover:text-emerald-500 hover:border-emerald-500 transition-all cursor-pointer bg-white/50 shrink-0"
                        title="Mark as done"
                    >
                        <CheckCircle2 size={14} className="group-hover:text-emerald-500" />
                    </button>
                )}

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${dimmed ? 'bg-slate-100' : 'bg-white shadow-sm'}`}>
                    {icons[event.type]}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{event.title}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5 font-medium">{event.date} • {event.time || 'All day'}</p>
                </div>

                {!dimmed && (
                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-[9px] uppercase font-bold px-2.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                        {event.type}
                    </Badge>
                )}
            </div>

            {event.description && (
                <div className="mt-3 relative z-10 ml-10">
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic border-l-2 border-slate-200 pl-3">
                        "{event.description}"
                    </p>
                </div>
            )}
        </div>
    );
}
