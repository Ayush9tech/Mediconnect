
"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, FileText, UserCheck, Clock, History } from "lucide-react";
import { useRouter } from "next/navigation";

const ACTIVITIES = [
  { 
    id: 1, 
    type: "share", 
    title: "Letter shared by Dr. Smith", 
    time: "2 hours ago", 
    status: "New", 
    icon: Share2,
    path: "/shared/inbox"
  },
  { 
    id: 2, 
    type: "create", 
    title: "New consultation: Alice Thompson", 
    time: "4 hours ago", 
    status: "Draft", 
    icon: FileText,
    path: "/letters/new"
  },
  { 
    id: 3, 
    type: "view", 
    title: "Dr. Johnson viewed your share", 
    time: "Yesterday", 
    status: "Viewed", 
    icon: UserCheck,
    path: "/shared/history"
  },
];

export function RecentActivity() {
  const router = useRouter();

  const handleActivityClick = (path: string) => {
    router.push(path);
  };

  return (
    <Card className="shadow-sm border-none ring-1 ring-border overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-muted/20">
        <CardTitle className="text-xl font-headline flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Live
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {ACTIVITIES.map((activity) => (
            <div 
              key={activity.id} 
              onClick={() => handleActivityClick(activity.path)}
              className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-all cursor-pointer group outline-none focus-visible:bg-muted/80"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleActivityClick(activity.path);
                }
              }}
            >
              <div className="mt-0.5 p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {activity.title}
                  </p>
                  <Badge 
                    variant={activity.status === "New" ? "default" : "outline"} 
                    className={`text-[10px] h-5 px-1.5 ${
                      activity.status === "New" ? "bg-accent hover:bg-accent border-none" : ""
                    }`}
                  >
                    {activity.status}
                  </Badge>
                </div>
                <div className="flex items-center text-[11px] text-muted-foreground gap-1.5">
                  <Clock className="h-3 w-3" />
                  <span>{activity.time}</span>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="capitalize">{activity.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-muted/10 border-t">
          <button 
            onClick={() => router.push("/shared/history")}
            className="text-xs font-bold text-primary hover:text-primary/70 transition-colors w-full text-center uppercase tracking-widest"
          >
            View Full Audit Log
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
