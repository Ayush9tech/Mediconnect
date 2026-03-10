
"use client";

import React from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const appointments = [
    { id: 1, time: "09:00 AM", patient: "John Doe", type: "Consultation" },
    { id: 2, time: "10:30 AM", patient: "Alice Thompson", type: "Follow-up" },
    { id: 3, time: "02:00 PM", patient: "Michael Chen", type: "Surgery Review" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <h2 className="text-3xl font-headline font-bold text-primary">Clinical Calendar</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-none ring-1 ring-border shadow-sm h-fit">
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-none"
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-none ring-1 ring-border shadow-sm">
            <CardHeader className="bg-muted/10 border-b">
              <CardTitle className="text-lg">Appointments for {date?.toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {appointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors">
                  <div className="flex gap-4 items-center">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{apt.time}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" /> {apt.patient}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{apt.type}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
