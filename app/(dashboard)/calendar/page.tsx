import React from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";

import { Calendar } from "lucide-react";

export default function CalendarPage() {
    return (
        <>
            <DashboardHeader
                title="Calendar"
                subtitle="Your upcoming schedule"
            />

            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <Card className="glass border-none shadow-xl p-12 text-center max-w-md">
                    <CardContent className="pt-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <Calendar size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900/80 mb-2">Calendar Coming Soon</h2>
                        <p className="text-slate-500 font-medium">
                            We're working on a beautiful interactive calendar to help you track baby's growth and appointments.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
