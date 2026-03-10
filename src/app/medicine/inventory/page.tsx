"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  ChevronRight,
  Home, 
  Search, 
  Lock, 
  Calculator, 
  FileText, 
  Users, 
  Percent, 
  Monitor, 
  Bell, 
  Info, 
  Power,
  Database,
  Settings,
  Mail,
  Printer,
  Barcode,
  BarChart3,
  Clock,
  History,
  Hammer,
  Wrench,
  Package,
  ShoppingCart,
  Receipt,
  Wallet,
  UserPlus,
  Truck,
  Box,
  Banknote,
  LayoutDashboard,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function MedicineInventoryPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, ' ');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  if (!mounted) return <div className="min-h-screen bg-[#0A192F]" />;

  return (
    <div className="flex h-screen bg-[#F4F7F9] overflow-hidden font-sans">
      {/* SIDEBAR - LEFT */}
      <aside className="w-[180px] bg-[#2D3436] flex flex-col shrink-0 border-r border-gray-700">
        <div className="flex-1 overflow-y-auto">
          <SidebarItem icon={Menu} label="Master Entry" />
          <SidebarItem icon={ShoppingCart} label="Transaction" />
          <SidebarItem icon={Wrench} label="Utilities" />
          <SidebarItem icon={Printer} label="Import / Export" />
          <SidebarItem icon={Users} label="Payroll" />
          <SidebarItem icon={Banknote} label="Banking" />
          <SidebarItem icon={FileText} label="Records" />
          <SidebarItem icon={BarChart3} label="Reports" />
          <SidebarItem icon={Percent} label="Tax Report" />
          <SidebarItem icon={Barcode} label="Barcode" />
          <SidebarItem icon={Database} label="Database" />
          <SidebarItem icon={Mail} label="Messenger" />
          <SidebarItem icon={Settings} label="Setting" />
          <SidebarItem icon={History} label="Logs" />
          <SidebarItem icon={Hammer} label="Tools" />
        </div>
        <div className="p-4 bg-black/20 text-center">
          <p className="text-[10px] text-gray-500 font-bold">Administrator</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-20 bg-[#0A192F] flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 group/nav min-w-[8px] h-10">
            <div className="flex items-center gap-1.5 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push("/dashboard")}
                className="text-white hover:bg-white/10 h-7 w-7"
                title="Home"
              >
                <Home className="h-4 w-4" />
              </Button>
              
              {/* Pill Navigation - Minimized */}
              <div className="flex items-center border border-white/20 rounded-full p-0.5 bg-black/20">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => router.back()}
                  className="text-white hover:bg-white/10 h-6 w-6 rounded-full"
                  title="Go Back"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <div className="w-[1px] h-3 bg-white/20 mx-0.5" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => router.forward()}
                  className="text-white hover:bg-white/10 h-6 w-6 rounded-full"
                  title="Go Forward"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="h-10 w-10 bg-white rounded-md flex items-center justify-center p-1 overflow-hidden ml-2">
              <img src="https://picsum.photos/seed/med-logo/100/100" alt="Logo" className="object-contain" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-[#2ed573] text-2xl font-black tracking-tight leading-none uppercase">
              {formatDate(currentTime)} {formatTime(currentTime)}
            </div>
            <div className="text-[#2ed573] text-sm font-bold opacity-80 uppercase tracking-[0.3em] mt-1">
              {formatDay(currentTime)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UtilityIcon icon={Lock} />
            <UtilityIcon icon={Calculator} />
            <UtilityIcon icon={Search} />
            <UtilityIcon icon={Users} />
            <UtilityIcon icon={Percent} />
            <UtilityIcon icon={Monitor} />
            <UtilityIcon icon={Monitor} secondary />
            <UtilityIcon icon={Bell} badge="3" />
            <UtilityIcon icon={Info} />
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-red-600 hover:bg-red-700 text-white rounded-md h-10 w-10 shadow-lg"
              onClick={() => router.push("/")}
            >
              <Power className="h-5 w-5 stroke-[3]" />
            </Button>
          </div>
        </header>

        {/* HERO SECTION */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 relative bg-gradient-to-br from-[#0984e3] to-[#00a8ff] overflow-hidden flex flex-col items-center justify-center">
            {/* Hexagonal Grid Overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='104' viewBox='0 0 60 104' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 104V88h-2L30 74 2 88H0v16h60zM30 44L0 30V0h60v30L30 44z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 104px'
            }}></div>

            <div className="relative z-10 text-center space-y-2 mb-12">
              <h1 className="text-white text-6xl font-black tracking-tighter drop-shadow-2xl">Pharmacy</h1>
              <p className="text-white text-3xl font-bold tracking-tight opacity-90 drop-shadow-lg">The backbone of healthcare Services</p>
            </div>

            {/* Pill & Bubbles Graphic */}
            <div className="relative w-full max-w-4xl h-64 z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-4">
                <div className="w-48 h-24 bg-white/90 rounded-full border-4 border-gray-200 flex items-center justify-center rotate-[-15deg] shadow-2xl">
                  <span className="text-[#2D3436] font-black text-xl">Med</span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center max-w-lg gap-4">
                  <Bubble label="Toxicology" size="sm" />
                  <Bubble label="D. Pharma" size="lg" />
                  <Bubble label="M. Pharma." size="lg" />
                  <Bubble label="B. Pharma." size="lg" />
                  <Bubble label="#ihoik" size="sm" />
                </div>

                <div className="w-48 h-24 bg-red-600 rounded-full border-4 border-red-700 flex items-center justify-center rotate-[15deg] shadow-2xl">
                  <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </main>

          {/* RIGHT ACTION MENU */}
          <aside className="w-[220px] bg-[#2D3436] p-2 space-y-1 border-l border-gray-700 overflow-y-auto shrink-0">
            <MenuButton label="Sale" shortcut="F1" icon={ShoppingCart} />
            <MenuButton label="Purchase" shortcut="F2" icon={Package} />
            <MenuButton label="Receipt" shortcut="F3" icon={Receipt} />
            <MenuButton label="Payment" shortcut="F4" icon={Wallet} />
            <MenuButton label="Customer" shortcut="F5" icon={UserPlus} />
            <MenuButton label="Supplier" shortcut="F6" icon={Truck} />
            <MenuButton label="Product" shortcut="F7" icon={Box} />
            <MenuButton label="Expense" shortcut="F8" icon={Banknote} />
          </aside>
        </div>

        {/* STATS GRID FOOTER AREA */}
        <div className="bg-white border-t p-4 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-4">
              <h2 className="text-[#2D3436] font-black text-lg">RAINTECH PHARMA</h2>
              <div className="text-[11px] text-gray-500 font-bold space-y-1">
                <p>Address : KOTTAYAM</p>
                <p>Email : info@raintechpos.com</p>
                <p>Contact : 8078311945</p>
                <p>License No. : </p>
                <p>State : Kerala [32]</p>
              </div>
            </div>
            
            <div className="col-span-4 grid grid-cols-5 gap-2">
              <StatBox label="Today's Cash-in-Hand" value="₹ 400.01" />
              <StatBox label="Today's Total Sales" value="₹ 500.01" />
              <StatBox label="Today's Total Purchases" value="₹ 1,000.14" />
              <StatBox label="Today's Total Receipts" value="₹ 0.00" />
              <StatBox label="Today's Salary Advance" value="₹ 0.00" />
              
              <StatBox label="Today's Total Expenses" value="₹ 0.00" />
              <StatBox label="Today's Sales Return" value="₹ 0.00" />
              <StatBox label="Today's Purchases Return" value="₹ 0.00" />
              <StatBox label="Today's Payments" value="₹ 100.00" />
              <StatBox label="Today's Employee Salary" value="₹ 0.00" />
            </div>
          </div>
        </div>

        {/* BOTTOM STATUS BAR */}
        <footer className="h-8 bg-[#2ed573] flex items-center justify-between px-4 text-[10px] font-black text-white shrink-0 uppercase tracking-wider">
          <div className="flex gap-4">
            <span>Logged in As: 🟢 Admin : admin</span>
            <span className="opacity-60">|</span>
            <span>Raintech Software Ltd</span>
            <span className="opacity-60">|</span>
            <span>Support: +91 8606093110</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} {formatTime(currentTime)}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors border-b border-gray-700/50 group">
      <div className="p-1.5 rounded bg-gray-700/50 text-gray-400 group-hover:text-white group-hover:bg-[#0984e3] transition-all">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400 group-hover:text-white">{label}</span>
    </div>
  );
}

function UtilityIcon({ icon: Icon, secondary, badge }: { icon: any, secondary?: boolean, badge?: string }) {
  return (
    <div className={cn(
      "h-10 w-10 flex items-center justify-center rounded border border-white/20 cursor-pointer hover:bg-white/10 relative",
      secondary ? "bg-white/5" : "bg-transparent"
    )}>
      <Icon className="h-5 w-5 text-white" />
      {badge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce shadow-lg">
          {badge}
        </span>
      )}
    </div>
  );
}

function Bubble({ label, size }: { label: string, size: 'sm' | 'lg' }) {
  return (
    <div className={cn(
      "bg-white rounded-full flex items-center justify-center font-black text-primary shadow-xl border-4 border-gray-100",
      size === 'lg' ? "h-20 w-20 text-xs" : "h-14 w-14 text-[8px]"
    )}>
      <span className="truncate px-1">{label}</span>
    </div>
  );
}

function MenuButton({ label, shortcut, icon: Icon }: { label: string, shortcut: string, icon: any }) {
  return (
    <div className="flex items-center justify-between bg-white/10 rounded border border-white/5 p-3 cursor-pointer hover:bg-[#0984e3] hover:border-[#0984e3] group transition-all">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded bg-black/20 flex items-center justify-center group-hover:bg-white/20">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <span className="text-white font-black text-xs uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-[10px] font-black text-white/40 group-hover:text-white">{shortcut}</span>
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-gray-50 p-2 rounded border border-gray-100 text-center flex flex-col justify-center">
      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-xs font-black text-[#2D3436] tracking-tight">{value}</p>
    </div>
  );
}
