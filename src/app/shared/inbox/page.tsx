
"use client";

import React from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Clock, User, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const SHARED_INCOMING = [
  { id: 1, sender: "Dr. Sarah Smith", title: "Referral: John Doe", date: "2 hours ago", urgent: true },
  { id: 2, sender: "Dr. Michael Ross", title: "Imaging Results: Alice Thompson", date: "1 day ago", urgent: false },
  { id: 3, sender: "Dr. Jane Foster", title: "Consultation Note: Kevin Baker", date: "2 days ago", urgent: false },
];

export default function SharedInboxPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">Shared with Me</h2>
          <p className="text-muted-foreground">Clinical records and letters shared by your colleagues.</p>
        </div>

        <div className="grid gap-4">
          {SHARED_INCOMING.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow border-none ring-1 ring-border group">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-xl ${item.urgent ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                      <Share2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                        {item.urgent && <Badge variant="destructive">Urgent</Badge>}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {item.sender}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {item.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Ignore</Button>
                    <Button size="sm" className="bg-primary group-hover:bg-primary/90">
                      Open Record <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {SHARED_INCOMING.length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-lg border-2 border-dashed">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No shared records found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
