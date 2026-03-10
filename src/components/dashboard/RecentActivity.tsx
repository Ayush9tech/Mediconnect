
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, FileText, UserCheck, Clock, History, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase/provider";
import { getDoctorProfile } from "@/lib/auth";

interface Activity {
  id: string;
  type: 'create-letter' | 'add-patient' | 'share' | 'receive' | 'view';
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'create-letter':
      return FileText;
    case 'add-patient':
      return UserCheck;
    case 'share':
    case 'receive':
      return Share2;
    case 'view':
      return UserCheck;
    default:
      return History;
  }
}

function getActivityPath(type: string): string {
  switch (type) {
    case 'create-letter':
      return "/letters";
    case 'add-patient':
      return "/patients";
    case 'share':
    case 'receive':
      return "/shared/inbox";
    case 'view':
      return "/shared/history";
    default:
      return "/dashboard";
  }
}

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const activityDate = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - activityDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return activityDate.toLocaleDateString();
}

export function RecentActivity() {
  const router = useRouter();
  const { user } = useUser();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getDoctorProfile(user.uid).then(profile => {
        if (profile && profile.activities) {
          // Sort activities by timestamp, most recent first
          const sortedActivities = [...profile.activities].sort((a, b) => {
            const timeA = new Date(a.timestamp).getTime();
            const timeB = new Date(b.timestamp).getTime();
            return timeB - timeA;
          });
          setActivities(sortedActivities);
        }
        setIsLoading(false);
      }).catch(error => {
        console.error("Error loading activities:", error);
        // Try localStorage fallback
        const STORAGE_KEY = 'mediconnect_doctor_profiles';
        const profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const localProfile = profiles[user.uid];
        if (localProfile && localProfile.activities) {
          const sortedActivities = [...localProfile.activities].sort((a: any, b: any) => {
            const timeA = new Date(a.timestamp).getTime();
            const timeB = new Date(b.timestamp).getTime();
            return timeB - timeA;
          });
          setActivities(sortedActivities);
        }
        setIsLoading(false);
      });
    }
  }, [user]);

  const handleActivityClick = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
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
        <CardContent className="p-4">
          <div className="text-center text-sm text-muted-foreground">Loading activities...</div>
        </CardContent>
      </Card>
    );
  }

  const displayActivities = activities.slice(0, 5);

  return (
    <Card className="shadow-sm border-none ring-1 ring-border overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-muted/20">
        <CardTitle className="text-xl font-headline flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-primary">
          {activities.length > 0 ? "Live" : "Empty"}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        {displayActivities.length === 0 ? (
          <div className="p-6 text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 rounded-lg bg-primary/10">
                <Plus className="h-6 w-6 text-primary/40" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">No activities yet</p>
              <p className="text-xs text-muted-foreground/70">Create a letter or add a patient to get started</p>
            </div>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border">
              {displayActivities.map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                const path = getActivityPath(activity.type);
                
                return (
                  <div 
                    key={activity.id} 
                    onClick={() => handleActivityClick(path)}
                    className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-all cursor-pointer group outline-none focus-visible:bg-muted/80"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleActivityClick(path);
                      }
                    }}
                  >
                    <div className="mt-0.5 p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {activity.title}
                        </p>
                        <Badge 
                          variant={activity.type === 'receive' ? "default" : "outline"} 
                          className={`text-[10px] h-5 px-1.5 ${
                            activity.type === 'receive' ? "bg-accent hover:bg-accent border-none" : ""
                          }`}
                        >
                          {activity.type === 'create-letter' && 'Created'}
                          {activity.type === 'add-patient' && 'Added'}
                          {activity.type === 'share' && 'Shared'}
                          {activity.type === 'receive' && 'Received'}
                          {activity.type === 'view' && 'Viewed'}
                        </Badge>
                      </div>
                      <div className="flex items-center text-[11px] text-muted-foreground gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                        <span className="text-muted-foreground/30">•</span>
                        <span className="capitalize">{activity.type.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-3 bg-muted/10 border-t">
              <button 
                onClick={() => router.push("/shared/history")}
                className="text-xs font-bold text-primary hover:text-primary/70 transition-colors w-full text-center uppercase tracking-widest"
              >
                View Full Audit Log
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
