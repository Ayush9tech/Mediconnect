
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
  ChevronLeft, ChevronRight, Home, Sun, Moon, Pill, BarChart3, Package, ShoppingCart, ChevronDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

export function MediMenuBar({ userRole = "doctor" }: { userRole?: "admin" | "doctor" }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const auth = useAuth();
  const { user } = useUser();
  const firestore = useFirestore();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  const profileRef = useMemoFirebase(
    () => (user ? doc(firestore, "store_users", user.uid) : null),
    [user, firestore]
  );
  const { data: profile } = useDoc(profileRef);

  const isDashboard = pathname === "/dashboard";
  const isLogin = pathname === "/";

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = (e: React.MouseEvent) => {
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
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Signed Out",
        description: "Your clinical session has been closed.",
      });
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: "Failed to close session correctly.",
      });
    }
  };

  const handleAction = (title: string, description: string) => {
    toast({
      title,
      description,
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

  const initials = profile?.firstName && profile?.lastName 
    ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
    : (user?.email?.[0]?.toUpperCase() || "DR");

  const fullName = profile?.firstName && profile?.lastName 
    ? `Dr. ${profile.firstName} ${profile.lastName}`
    : (user?.email || "Medical Professional");

  return (
    <div className="w-full bg-card border-b px-3 md:px-4 py-1.5 md:py-2 sticky top-0 z-50 flex items-center justify-between print:hidden shadow-sm">
      <div className="flex items-center gap-1 md:gap-3">
        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-primary font-headline text-2xl flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary text-white">
                    <Home className="h-5 w-5" />
                  </div>
                  MediConnect
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 p-2">
                <MobileNavItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" active={isDashboard} />
                <MobileNavItem icon={Pill} label="Medicine Store" href="/medicine" active={pathname?.startsWith("/medicine")} />
                <MobileNavItem icon={FileText} label="Letters" href="/letters" active={pathname === "/letters"} />
                <MobileNavItem icon={Users} label="Patients" href="/patients" active={pathname === "/patients"} />
                <MobileNavItem icon={Calendar} label="Calendar" href="/calendar" active={pathname === "/calendar"} />
                <MobileNavItem icon={BookOpen} label="Directory" href="/directory" active={pathname === "/directory"} />
                <div className="h-px bg-border my-1" />
                <MobileNavItem icon={Inbox} label="Inbox" href="/shared/inbox" active={pathname === "/shared/inbox"} />
                <MobileNavItem icon={History} label="Audit Log" href="/shared/history" active={pathname === "/shared/history"} />
                <MobileNavItem icon={Settings} label="Settings" href="/settings" active={pathname === "/settings"} />
                <div className="h-px bg-border my-1" />
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut} 
                  className="text-destructive w-full justify-start gap-3 px-3 py-2 cursor-pointer font-medium hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Global Navigation Actions */}
        <div className="flex items-center gap-1 group/nav min-w-[8px] h-9">
          {/* Home Button - Always Visible */}
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
            className={`h-7 w-7 hover:bg-primary/10 hover:text-primary transition-colors ${isDashboard ? 'text-primary bg-primary/10' : ''}`}
            title="Go to Dashboard"
          >
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
            </Link>
          </Button>

          {/* Back/Forward - Auto-hide on hover group */}
          <div className="flex items-center gap-1 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300">
            <div className="flex items-center border border-border rounded-full p-0.5 bg-muted/30">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()} 
                disabled={isLogin}
                className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                title="Go Back"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <div className="w-[1px] h-3 bg-border mx-0.5" />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.forward()} 
                disabled={isLogin}
                className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                title="Go Forward"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <Link 
          href="/dashboard"
          className="font-headline font-bold text-primary text-base md:text-xl ml-1 hidden xs:block truncate"
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
                <MenubarItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Exit Session
                </MenubarItem>
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
          </Menubar>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex gap-1 border-primary/20 text-primary hover:bg-primary/5 h-8 md:h-9 px-2 md:px-3"
            >
              <Pill className="h-4 w-4" />
              <ChevronDown className="h-3 w-3 opacity-50 hidden sm:inline" />
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
              className="flex items-center gap-0 text-sm text-muted-foreground hover:text-primary transition-all outline-none rounded-full p-0.5 group h-auto border border-primary/10 hover:border-primary/30 hover:bg-primary/5 shrink-0"
            >
              <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                {initials}
              </div>
              <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-2 group-hover:mr-2 transition-all duration-500 ease-in-out font-medium whitespace-nowrap hidden sm:inline">
                {fullName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Account Information</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); toggleTheme(e as any); }}>
               <div className="flex items-center justify-between w-full">
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
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function MobileNavItem({ icon: Icon, label, href, className, active }: any) {
  return (
    <Button 
      variant={active ? "secondary" : "ghost"}
      asChild
      className={`w-full justify-start text-sm font-medium h-10 px-3 ${className} ${active ? 'text-primary bg-primary/10' : ''}`} 
    >
      <Link href={href}>
        <Icon className={`mr-3 h-4 w-4 ${active ? 'text-primary' : ''}`} />
        {label}
      </Link>
    </Button>
  );
}
