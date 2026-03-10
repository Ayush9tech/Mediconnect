
"use client";

import React, { useEffect, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";
import { 
  FilePlus, FolderOpen, Save, Printer, LogOut,
  Undo, Redo, Copy, Clipboard,
  LayoutDashboard, Users, FileText, Calendar, BookOpen,
  UserPlus, History, Settings,
  Info, LifeBuoy, User, Maximize, Inbox, Menu,
  ChevronLeft, Home, Sun, Moon, Pill, BarChart3, Package, ShoppingCart, ChevronDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logOut } from "@/lib/auth";
import { useUser } from "@/firebase/provider";
import { getDoctorProfile, saveDoctorProfile } from "@/lib/auth";

export function MediMenuBar({ userRole = "doctor" }: { userRole?: "admin" | "doctor" }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { user } = useUser();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [doctorName, setDoctorName] = useState("Doctor");

  const isDashboard = pathname === "/dashboard";
  const isLogin = pathname === "/";

  useEffect(() => {
    setMounted(true);

    const loadThemeAndProfile = async () => {
      if (user) {
        try {
          const profile = await getDoctorProfile(user.uid);
          if (profile) {
            setDoctorName(profile.name);

            // Apply theme from profile
            if (profile.theme) {
              if (profile.theme === 'system') {
                const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                setTheme(systemTheme);
                if (systemTheme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } else {
                setTheme(profile.theme);
                if (profile.theme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              }
              return; // Don't load from localStorage if profile has theme
            }
          }
        } catch (error) {
          console.error("Error loading profile for theme:", error);
          // Try to get from localStorage as fallback
          const STORAGE_KEY = 'mediconnect_doctor_profiles';
          const profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
          const localProfile = profiles[user.uid];
          if (localProfile) {
            setDoctorName(localProfile.name);
          }
        }
      }

      // Fallback to localStorage or system preference
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      setTheme(initialTheme);
      if (initialTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    loadThemeAndProfile();
  }, [user]);

  const toggleTheme = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save theme preference to user profile
    if (user) {
      try {
        await saveDoctorProfile(user.uid, { theme: newTheme });
      } catch (error) {
        console.error("Error saving theme preference:", error);
      }
    }
  };

  const handleAction = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  const handleEditAction = (label: string) => {
    toast({
      title: label,
      description: `Action "${label}" triggered. Standard shortcuts are supported.`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        toast({
          variant: "destructive",
          title: "Full Screen Error",
          description: `Error: ${err.message}`,
        });
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full bg-card border-b px-4 py-2 sticky top-0 z-50 flex items-center justify-between print:hidden shadow-sm">
      <div className="flex items-center gap-1 md:gap-3">
        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle className="text-primary font-headline text-2xl flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary text-white">
                    <Home className="h-5 w-5" />
                  </div>
                  MediConnect
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-8">
                <MobileNavItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" active={isDashboard} />
                <MobileNavItem icon={Pill} label="Medicine Store" href="/medicine" active={pathname?.startsWith("/medicine")} />
                <MobileNavItem icon={FileText} label="Letters" href="/letters" active={pathname === "/letters"} />
                <MobileNavItem icon={Users} label="Patients" href="/patients" active={pathname === "/patients"} />
                <MobileNavItem icon={Calendar} label="Calendar" href="/calendar" active={pathname === "/calendar"} />
                <MobileNavItem icon={BookOpen} label="Directory" href="/directory" active={pathname === "/directory"} />
                <MobileNavItem icon={Inbox} label="Inbox" href="/shared/inbox" active={pathname === "/shared/inbox"} />
                <MobileNavItem icon={History} label="Audit Log" href="/shared/history" active={pathname === "/shared/history"} />
                <MobileNavItem icon={Settings} label="Settings" href="/settings" active={pathname === "/settings"} />
                <div className="h-px bg-border my-2" />
                <MobileNavItem icon={LogOut} label="Sign Out" onClick={handleLogout} className="text-destructive" />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Global Navigation Actions */}
        <div className="flex items-center gap-1">
          {!isDashboard && !isLogin && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()} 
              className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors"
              title="Go Back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
            className={`h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors ${isDashboard ? 'text-primary bg-primary/10' : ''}`}
            title="Go to Dashboard"
          >
            <Link href="/dashboard">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <Link 
          href="/dashboard"
          className="font-headline font-bold text-primary text-lg md:text-xl ml-1 hidden xs:block"
        >
          MediConnect
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex ml-4">
          <Menubar className="border-none bg-transparent shadow-none">
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild>
                  <Link href="/letters/new"><FilePlus className="mr-2 h-4 w-4" /> New Letter</Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link href="/letters"><FolderOpen className="mr-2 h-4 w-4" /> Open</Link>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => handleAction("Save", "Document saved.")}><Save className="mr-2 h-4 w-4" /> Save</MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</MenubarItem>
                <MenubarSeparator />
                <MenubarItem asChild>
                  <Link href="/"><LogOut className="mr-2 h-4 w-4" /> Exit</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => handleEditAction("Undo")}><Undo className="mr-2 h-4 w-4" /> Undo</MenubarItem>
                <MenubarItem onClick={() => handleEditAction("Redo")}><Redo className="mr-2 h-4 w-4" /> Redo</MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => handleEditAction("Copy")}><Copy className="mr-2 h-4 w-4" /> Copy</MenubarItem>
                <MenubarItem onClick={() => handleEditAction("Paste")}><Clipboard className="mr-2 h-4 w-4" /> Paste</MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">View</MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild>
                  <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link href="/medicine"><Pill className="mr-2 h-4 w-4" /> Medicine Store</Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link href="/patients"><Users className="mr-2 h-4 w-4" /> Patients</Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link href="/letters"><FileText className="mr-2 h-4 w-4" /> Letters</Link>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={toggleFullScreen}><Maximize className="mr-2 h-4 w-4" /> Full Screen</MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">Tools</MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild>
                  <Link href="/templates"><FileText className="mr-2 h-4 w-4" /> Templates Manager</Link>
                </MenubarItem>
                {userRole === "admin" && (
                  <MenubarItem asChild>
                    <Link href="/admin/users"><Users className="mr-2 h-4 w-4" /> User Management</Link>
                  </MenubarItem>
                )}
                <MenubarSeparator />
                <MenubarItem onClick={() => handleAction("Clinical Dictionary", "Opening medical reference...")}><BookOpen className="mr-2 h-4 w-4" /> Clinical Dictionary</MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">Share</MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild>
                  <Link href="/directory"><UserPlus className="mr-2 h-4 w-4" /> Share with Doctor</Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link href="/shared/inbox"><Inbox className="mr-2 h-4 w-4" /> Incoming Shares</Link>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem asChild>
                  <Link href="/shared/history"><History className="mr-2 h-4 w-4" /> Sharing History</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">Help</MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild>
                  <Link href="/help"><LifeBuoy className="mr-2 h-4 w-4" /> Documentation</Link>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => handleAction("Checking for updates", "Connecting to server...")}><Info className="mr-2 h-4 w-4" /> Check for Updates</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex gap-1 border-primary/20 text-primary hover:bg-primary/5 h-9"
            >
              <Pill className="h-4 w-4" />
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-widest px-2 py-1.5">Store Operations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/medicine" className="flex items-center w-full">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Store Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/medicine/inventory" className="flex items-center w-full">
                <Package className="mr-2 h-4 w-4" /> Inventory Catalog
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/medicine/sales/new" className="flex items-center w-full">
                <ShoppingCart className="mr-2 h-4 w-4 text-accent" /> New Billing (Sale)
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/medicine/reports" className="flex items-center w-full">
                <BarChart3 className="mr-2 h-4 w-4" /> Analytics & Reports
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-0 text-sm text-muted-foreground hover:text-primary transition-all outline-none rounded-full p-1 group h-auto border border-primary/10 hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                {doctorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-2 group-hover:mr-2 transition-all duration-500 ease-in-out font-medium whitespace-nowrap">
                {doctorName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Account Information</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
               <div className="flex items-center justify-between w-full" onClick={toggleTheme}>
                 <div className="flex items-center">
                   {theme === "light" ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                   <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                 </div>
               </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings"><User className="mr-2 h-4 w-4" /> Profile Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings"><Settings className="mr-2 h-4 w-4" /> Preferences</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function MobileNavItem({ icon: Icon, label, href, onClick, className, active }: any) {
  return (
    <Button 
      variant={active ? "secondary" : "ghost"}
      asChild={!!href}
      onClick={onClick}
      className={`w-full justify-start text-base font-medium h-12 ${className} ${active ? 'text-primary bg-primary/10' : ''}`} 
    >
      {href ? (
        <Link href={href}>
          <Icon className={`mr-3 h-5 w-5 ${active ? 'text-primary' : ''}`} />
          {label}
        </Link>
      ) : (
        <div className="flex items-center">
          <Icon className={`mr-3 h-5 w-5 ${active ? 'text-primary' : ''}`} />
          {label}
        </div>
      )}
    </Button>
  );
}
