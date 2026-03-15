
"use client";

import React from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Share2, Calendar as CalendarIcon, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  const profileRef = useMemoFirebase(
    () => (user ? doc(firestore, "store_users", user.uid) : null),
    [user, firestore]
  );
  const { data: profile } = useDoc(profileRef);

  const displayName = profile?.firstName ? `Dr. ${profile.firstName}` : (user?.displayName || "Doctor");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar />
      <main className="flex-1 p-3 md:p-4 lg:p-6 max-w-7xl mx-auto w-full space-y-4 -mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-primary leading-tight">
              Welcome back, {displayName}
            </h2>
            <p className="text-[10px] md:text-xs text-muted-foreground leading-tight">Here is what's happening in your clinic today.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="bg-primary hover:bg-primary/90 shadow-sm h-9 text-xs w-full sm:w-auto px-6">
              <Link href="/letters/new">New Letter</Link>
            </Button>
            <Button variant="outline" className="shadow-sm h-9 text-xs w-full sm:w-auto px-4 bg-white/50">Schedule Follow-up</Button>
          </div>
        </div>

        {/* Liquid Glass Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard 
            title="My Letters" 
            value="128" 
            icon={FileText} 
            trend="+4 this week" 
            onClick={() => router.push("/letters")}
          />
          <StatCard 
            title="Patients" 
            value="542" 
            icon={Users} 
            trend="+12 this month" 
            onClick={() => router.push("/patients")}
          />
          <StatCard 
            title="Received" 
            value="12" 
            icon={Share2} 
            trend="3 new alerts" 
            onClick={() => router.push("/shared/inbox")}
          />
          <StatCard 
            title="Next Appointment" 
            value="2:30 PM" 
            icon={CalendarIcon} 
            trend="Alice Thompson" 
            onClick={() => router.push("/calendar")}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-sm border-none ring-1 ring-border overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between bg-muted/10 p-4">
                <CardTitle className="font-headline text-lg md:text-xl">Pending Tasks</CardTitle>
                <Button variant="ghost" size="sm" className="text-accent font-bold text-[10px] md:text-xs hover:bg-accent/10" onClick={() => router.push("/letters")}>VIEW ALL</Button>
              </CardHeader>
              <CardContent className="p-2 md:p-6">
                <div className="space-y-1">
                  {[
                    { id: 1, title: "Finalize Referral for John Doe", sub: "Drafted 2 days ago • High Priority" },
                    { id: 2, title: "Approve Consultation for Sarah Smith", sub: "Pending since yesterday" },
                    { id: 3, title: "Update Medical History - Michael Chen", sub: "Clinical note required" }
                  ].map(task => (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all cursor-pointer group"
                      onClick={() => router.push("/letters/new")}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors">{task.title}</p>
                          <p className="text-[10px] md:text-xs text-muted-foreground">{task.sub}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="secondary" className="hidden sm:flex group-hover:bg-primary group-hover:text-white transition-all shadow-sm">Resume</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <QuickLink title="Consultation Templates" description="Manage your library of letter drafts." icon={FileText} href="/templates" />
               <QuickLink title="Doctor Directory" description="Find specialists and share records." icon={Users} href="/directory" />
            </div>
          </div>

          <div className="space-y-4">
            <RecentActivity />
            <Card className="bg-accent/5 border-accent/20 shadow-sm overflow-hidden border-none ring-1 ring-accent/20 group transition-all duration-300">
              <CardHeader className="bg-accent/10 py-3 cursor-help">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  Upcoming Follow-ups
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                 <div className="flex justify-between items-center text-sm p-3 hover:bg-white rounded-md cursor-pointer transition-all group/item shadow-sm bg-card/50" onClick={() => router.push("/calendar")}>
                    <span className="font-semibold group-hover/item:text-accent">Sarah Miller</span>
                    <Badge variant="outline" className="text-[10px] bg-white border-accent/20">Tomorrow</Badge>
                 </div>
                 <div className="flex justify-between items-center text-sm p-3 hover:bg-white rounded-md cursor-pointer transition-all group/item shadow-sm bg-card/50" onClick={() => router.push("/calendar")}>
                    <span className="font-semibold group-hover/item:text-accent">Kevin Baker</span>
                    <Badge variant="outline" className="text-[10px] bg-white border-accent/20">Friday</Badge>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, highlight, onClick }: any) {
  return (
    <div 
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group min-h-[64px] rounded-xl overflow-hidden flex items-center px-4 py-2",
        "bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-0 hover:before:opacity-100 transition-opacity",
        highlight ? "ring-2 ring-accent/50 bg-accent/10" : "hover:border-primary/30"
      )} 
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full gap-3 relative z-10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform shadow-inner shrink-0">
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-base font-black font-headline leading-none truncate text-primary/90">{value}</p>
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 truncate">{title}</h3>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[8px] sm:text-[9px] text-primary/60 font-black uppercase tracking-tighter bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10 transition-all group-hover:bg-primary group-hover:text-white group-hover:border-primary">
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ title, description, icon: Icon, href }: any) {
  return (
    <Link href={href} className="block h-full">
      <div 
        className={cn(
          "relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group min-h-[72px] rounded-xl overflow-hidden flex items-center px-4 py-2",
          "bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-0 hover:before:opacity-100 transition-opacity",
          "hover:border-primary/30"
        )}
      >
        <div className="flex items-center justify-between w-full gap-3 relative z-10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform shadow-inner shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-black font-headline leading-none truncate text-primary/90">{title}</h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tight mt-1 line-clamp-1">{description}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="p-1 rounded-full bg-primary/5 text-primary/40 group-hover:text-primary group-hover:bg-primary/10 transition-all">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
