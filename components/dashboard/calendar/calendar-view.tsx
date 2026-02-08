"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    Syringe,
    Baby,
    Stethoscope,
    Plus,
    Loader2,
    Image as ImageIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddLogModal } from "./add-log-modal";
import { createClient } from "@/utils/supabase/client";

interface BabyEvent {
    id: string;
    activity_name: string;
    date: string;
    category: string;
    status: 'pending' | 'completed';
    notes?: string;
    image_url?: string;
}

export function CalendarView() {
    const supabase = createClient();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [events, setEvents] = useState<BabyEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvents = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('activity_log')
                .select('*')
                .eq('profile_id', user.id)
                .order('scheduled_date', { ascending: true });

            if (error) throw error;

            // Map database fields to UI component fields
            const mappedEvents = data.map((item: any) => ({
                id: item.id,
                activity_name: item.activity_name,
                date: item.scheduled_date || item.completed_date,
                category: item.category,
                status: item.status,
                notes: item.notes,
                image_url: item.image_url
            }));

            setEvents(mappedEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

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
        return events.filter(e => e.date === dateStr);
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full font-secondary">
            {/* Left Column: Date Grid */}
            <div className="lg:col-span-8 h-full">
                <Card className="glass border-none shadow-2xl overflow-hidden h-full flex flex-col">
                    <div className="p-6 border-b border-white/20 bg-white/10 flex items-center justify-between shrink-0">
                        <div>
                            <h3 className="text-2xl font-medium text-slate-900/80 font-primary italic">
                                {monthName} <span className="opacity-40">{year}</span>
                            </h3>
                            <p className="text-slate-500 font-medium text-[10px] uppercase tracking-wider mt-1">Leo's Journey Timeline</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handlePrevMonth}
                                className="p-2 hover:bg-white/40 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-slate-900 border border-white/20"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={handleNextMonth}
                                className="p-2 hover:bg-white/40 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-slate-900 border border-white/20"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 flex-1">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="h-10 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/20 border-r border-b border-slate-200/50">
                                {day}
                            </div>
                        ))}
                        {paddingArray.map((_, i) => (
                            <div key={`pad-${i}`} className="bg-white/5 border-r border-b border-slate-200/50" />
                        ))}
                        {daysArray.map(day => {
                            const dayEvents = getEventsForDay(day);
                            const today = new Date();
                            const isToday = day === today.getDate() &&
                                currentMonth.getMonth() === today.getMonth() &&
                                currentMonth.getFullYear() === today.getFullYear();
                            const isBooked = dayEvents.length > 0;
                            const dayWithImage = dayEvents.find(e => e.image_url);

                            return (
                                <div key={day} className={`
                                    p-2 border-r border-b border-slate-200/50 relative transition-all min-h-[100px] group overflow-hidden
                                    ${isToday ? 'bg-primary/5' : 'bg-white/10'}
                                    ${isBooked ? 'bg-white/20' : ''}
                                `}>
                                    {/* Image Background */}
                                    {dayWithImage && (
                                        <div className="absolute inset-0 z-0">
                                            <img
                                                src={dayWithImage.image_url}
                                                alt="Day entry"
                                                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                                            />
                                            {/* Gradient overlay for text readability */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                                        </div>
                                    )}

                                    {isBooked && !dayWithImage && (
                                        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_15px,#000_15px,#000_16px)]"></div>
                                    )}

                                    <div className="flex justify-between items-start relative z-10">
                                        <span className={`text-xs font-bold transition-colors ${dayWithImage ? 'text-white shadow-sm' : isToday ? 'text-primary' : 'text-slate-500'} ${isToday ? 'bg-primary/10 w-6 h-6 flex items-center justify-center rounded-full' : ''}`}>
                                            {day}
                                        </span>
                                    </div>

                                    <div className="mt-2 space-y-1 relative z-10">
                                        {dayEvents.slice(0, 2).map(event => (
                                            <div key={event.id} className={`
                                                    px-2 py-1 rounded-full text-[9px] font-bold border truncate relative backdrop-blur-[2px]
                                                    ${event.category === 'vaccination' ? 'bg-amber-100/90 text-amber-900 border-amber-200' :
                                                    event.category === 'checkup' ? 'bg-blue-100/90 text-blue-900 border-blue-200' :
                                                        'bg-emerald-100/90 text-emerald-900 border-emerald-200'}
                                                `}>
                                                <span className="relative z-10 leading-none">{event.activity_name}</span>
                                            </div>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <p className={`text-[8px] font-bold ml-1 w-fit px-1 rounded ${dayWithImage ? 'text-white bg-black/40' : 'text-slate-500 bg-white/60'}`}>+{dayEvents.length - 2} more</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* Right Column: Unified Event Logs Card */}
            <div className="lg:col-span-4 h-full min-h-0">
                {isLoading ? (
                    <Card className="glass border-none shadow-xl flex flex-col h-full items-center justify-center">
                        <Loader2 className="animate-spin text-primary" size={32} />
                        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-4">Syncing Records...</p>
                    </Card>
                ) : (
                    <UnifiedLogsCard events={events} onAddClick={() => setIsAddModalOpen(true)} />
                )}
            </div>

            <AddLogModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    fetchEvents();
                }}
            />
        </div>
    );
}

function UnifiedLogsCard({ events, onAddClick }: { events: BabyEvent[], onAddClick: () => void }) {
    const [view, setView] = useState<'upcoming' | 'recent'>('upcoming');

    const filteredEvents = events.filter(e =>
        view === 'upcoming' ? e.status === 'pending' : e.status === 'completed'
    );

    return (
        <Card className="glass border-none shadow-xl flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-white/20 shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-lg text-slate-800 flex items-center gap-2 font-primary">
                        {view === 'upcoming' ? <Clock size={16} className="text-primary" /> : <CheckCircle2 size={16} className="text-emerald-500" />}
                        Activity Logs
                    </h3>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-[10px] font-bold text-primary hover:bg-primary/5 cursor-pointer px-3 rounded-xl border border-primary/10"
                        onClick={onAddClick}
                    >
                        <Plus size={14} className="mr-1" /> Add New
                    </Button>
                </div>

                <div className="bg-slate-100/50 p-1 rounded-2xl border border-white/40 flex shadow-inner">
                    <button
                        onClick={() => setView('upcoming')}
                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all ${view === 'upcoming' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setView('recent')}
                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all ${view === 'recent' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Recent
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar min-h-0 bg-white/5">
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
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <CalendarIcon size={24} className="text-slate-400" />
                        </div>
                        <p className="font-bold text-[10px] uppercase tracking-widest text-slate-500">No {view} events found</p>
                    </div>
                )}
            </div>
        </Card>
    );
}

function EventCard({ event, dimmed, showCheck }: { event: BabyEvent, dimmed?: boolean, showCheck?: boolean }) {
    const icons: Record<string, React.ReactNode> = {
        vaccination: <Syringe size={14} className="text-amber-500" />,
        checkup: <Stethoscope size={14} className="text-blue-500" />,
        milestone: <Baby size={14} className="text-emerald-500" />,
        manual: <Plus size={14} className="text-slate-500" />
    };

    return (
        <div className={`p-4 rounded-2xl border border-white/40 bg-white/60 transition-all hover:bg-white/80 group cursor-pointer relative overflow-hidden shadow-sm ${dimmed ? 'opacity-70 grayscale-[0.2]' : 'hover:shadow-md hover:scale-[1.01]'}`}>
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[repeating-linear-gradient(-45deg,transparent,transparent_15px,#000_15px,#000_16px)]"></div>

            <div className="flex items-center gap-3 relative z-10">
                {showCheck && (
                    <button
                        className="w-5 h-5 rounded-full border-1.5 border-slate-200 flex items-center justify-center text-transparent hover:text-emerald-500 hover:border-emerald-500 transition-all cursor-pointer bg-white/50 shrink-0"
                        title="Mark as done"
                    >
                        <CheckCircle2 size={12} className="group-hover:text-emerald-500" />
                    </button>
                )}

                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${dimmed ? 'bg-slate-100' : 'bg-white shadow-sm border border-slate-50'}`}>
                    {icons[event.category] || icons.manual}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs truncate">{event.activity_name}</h4>
                    <p className="text-slate-400 text-[10px] mt-0.5 font-bold uppercase tracking-tight">{event.date}</p>
                </div>

                {event.image_url && (
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-white shadow-sm shrink-0">
                        <img src={event.image_url} alt="Log" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

            {event.notes && (
                <div className="mt-2.5 relative z-10 ml-9">
                    <p className="text-[10px] text-slate-400 line-clamp-1 leading-relaxed italic border-l-2 border-slate-100 pl-3">
                        "{event.notes}"
                    </p>
                </div>
            )}
        </div>
    );
}
