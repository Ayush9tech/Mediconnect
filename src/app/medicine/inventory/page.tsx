
"use client";

import React, { useState, useEffect, useRef } from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Plus, 
  Filter, 
  Pill, 
  MoreVertical, 
  Download,
  AlertTriangle,
  Barcode,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Settings,
  ShoppingCart,
  LayoutDashboard,
  FileText,
  BookOpen,
  BarChart3,
  Users,
  Wallet,
  Banknote,
  ArrowLeftRight,
  ClipboardCheck,
  CheckCircle2,
  Package,
  Scan,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const MEDICINES = [
  { 
    id: "M001", 
    name: "Arnica Montana", 
    company: "SBL World Class", 
    category: "Dilution", 
    potency: "30C", 
    stock: 12, 
    reorder: 5, 
    mrp: 124.50, 
    netRate: 81.52,
    saleRate: 124.50,
    expiry: "03/29",
    pack: "10's",
    location: "B29 ALU",
    status: "In Stock" 
  },
  { 
    id: "M002", 
    name: "Nux Vomica", 
    company: "Schwabe India", 
    category: "Mother Tincture", 
    potency: "Q", 
    stock: 3, 
    reorder: 5, 
    mrp: 210.00, 
    netRate: 145.00,
    saleRate: 210.00,
    expiry: "12/28",
    pack: "30ml",
    location: "A12 Shelf",
    status: "Low Stock" 
  },
  { 
    id: "M003", 
    name: "Belladonna", 
    company: "Dr. Reckeweg", 
    category: "Dilution", 
    potency: "200C", 
    stock: 25, 
    reorder: 10, 
    mrp: 180.00, 
    netRate: 112.00,
    saleRate: 180.00,
    expiry: "05/27",
    pack: "10's",
    location: "B10 ALU",
    status: "In Stock" 
  },
];

export default function MedicineInventoryPage() {
  const [selectedId, setSelectedId] = useState(MEDICINES[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const resetTimeout = () => {
      setIsFooterVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        setIsFooterVisible(false);
      }, 5000); // Auto-hide after 5 seconds of inactivity
    };

    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);
    window.addEventListener("click", resetTimeout);

    resetTimeout();

    return () => {
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keydown", resetTimeout);
      window.removeEventListener("click", resetTimeout);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const selectedMed = MEDICINES.find(m => m.id === selectedId) || MEDICINES[0];

  const filtered = MEDICINES.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBarcodeScan = () => {
    toast({
      title: "Barcode Scanner Initialized",
      description: "Scanning for medicine barcode...",
    });
  };

  const handleAddMedicine = () => {
    toast({
      title: "Add Medicine",
      description: "Opening medicine registration form...",
    });
  };

  const handleAlertsClick = () => {
    toast({
      title: "System Alerts",
      description: "You have 8 products below reorder level and 2 upcoming batch expiries.",
    });
  };

  const handleSettingsClick = () => {
    toast({
      title: "Inventory Configuration",
      description: "Accessing advanced settings for multi-store stock synchronization.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F9]">
      <MediMenuBar />
      
      {/* Secondary Top Nav */}
      <div className="bg-white border-b px-6 py-2 flex items-center justify-between sticky top-[65px] z-40 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">L</div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground leading-none">RETAILER</span>
              <span className="text-sm font-bold text-primary">DR. IQBAL'S STORE</span>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <button className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Purchases</button>
            <button className="text-sm font-bold text-primary border-b-2 border-primary pb-1">Stock on Hand</button>
            <button className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              Sales <span className="text-[10px] bg-amber-400 text-white px-1 rounded font-bold">POS</span>
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-primary/5 border-primary/20 text-primary font-black uppercase text-[10px]">
            Pro Mode: Active
          </Button>
          <div className="flex items-center gap-1 border-l pl-3">
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleAlertsClick}><AlertTriangle className="h-4 w-4" /></Button>
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSettingsClick}><Settings className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Module Sidebar */}
        <aside className={cn(
          "bg-[#2D3436] text-gray-300 transition-all duration-300 flex flex-col shrink-0",
          isSidebarCollapsed ? "w-16" : "w-60"
        )}>
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              {!isSidebarCollapsed && <Input placeholder="Quick Filter..." className="bg-transparent border-gray-700 h-8 pl-8 text-[10px] text-white focus:ring-1 focus:ring-primary" />}
            </div>
          </div>
          <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
            <SidebarItem icon={LayoutDashboard} label="Store Dashboard" collapsed={isSidebarCollapsed} />
            <SidebarItem icon={FileText} label="Sales Invoices" collapsed={isSidebarCollapsed} hasSub />
            <SidebarItem icon={ShoppingCart} label="Customer Orders" collapsed={isSidebarCollapsed} />
            <SidebarItem icon={BookOpen} label="Clinical Orderbook" collapsed={isSidebarCollapsed} badge="3" />
            <SidebarItem icon={BarChart3} label="GST & Reports" collapsed={isSidebarCollapsed} />
            <SidebarItem icon={Users} label="Supplier Registry" collapsed={isSidebarCollapsed} />
            <SidebarItem icon={Wallet} label="Expense Log" collapsed={isSidebarCollapsed} />
            <SidebarItem icon={Banknote} label="Cash/Bank Registry" collapsed={isSidebarCollapsed} hasSub />
            <SidebarItem icon={ArrowLeftRight} label="Inventory Transfer" collapsed={isSidebarCollapsed} />
            <SidebarItem icon={ClipboardCheck} label="Stock Audit" collapsed={isSidebarCollapsed} />
          </nav>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-400 hover:bg-gray-800 rounded-none px-4 py-6"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4 mr-3" />}
            {!isSidebarCollapsed && <span className="text-[10px] font-bold uppercase tracking-wider">Minimize Panel</span>}
          </Button>
        </aside>

        {/* Inventory Content */}
        <main className="flex-1 flex overflow-hidden">
          {/* List Column */}
          <div className="w-[380px] bg-white border-r flex flex-col shadow-inner shrink-0">
            <div className="p-4 border-b space-y-4 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-primary uppercase tracking-tight text-lg">Stock Registry</h3>
                <span className="text-[10px] font-black text-muted-foreground uppercase bg-white px-2 py-0.5 rounded shadow-sm">₹4.2L VALUE</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 flex-1 text-[10px] font-black uppercase" onClick={handleBarcodeScan}><Scan className="mr-1.5 h-3.5 w-3.5" /> Scan Barcode</Button>
                <Button variant="default" size="sm" className="h-8 flex-1 text-[10px] font-black uppercase bg-primary" onClick={handleAddMedicine}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add Product</Button>
              </div>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Fast Search (Name/Co/Cat)..." 
                  className="h-10 text-sm bg-white border-gray-200 shadow-sm" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y bg-white">
              {filtered.length > 0 ? filtered.map((med) => (
                <div 
                  key={med.id} 
                  className={cn(
                    "p-4 cursor-pointer hover:bg-primary/5 transition-all relative flex gap-3 border-l-4 border-transparent",
                    selectedId === med.id && "bg-primary/5 border-l-primary"
                  )}
                  onClick={() => setSelectedId(med.id)}
                >
                  <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border shadow-sm">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-black text-sm truncate text-[#2D3436]">{med.name}</span>
                      <span className="font-black text-xs text-primary">₹{med.mrp}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[9px] h-4 px-1 uppercase font-bold text-muted-foreground">{med.company}</Badge>
                      <Badge variant="outline" className="text-[9px] h-4 px-1 uppercase font-bold bg-primary/5 text-primary border-primary/20">{med.potency}</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant={med.stock <= med.reorder ? "destructive" : "outline"} className="text-[9px] px-1.5 h-4 font-black">
                        {med.status.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] font-black text-[#2D3436]">{med.stock} UNITS</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center space-y-2">
                  <Package className="h-12 w-12 text-gray-200 mx-auto" />
                  <p className="text-sm font-bold text-muted-foreground">No medicines match search</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="flex-1 bg-white p-8 overflow-y-auto custom-scrollbar">
            {/* Header / Info Section */}
            <div className="flex gap-8 mb-12">
              <div className="h-48 w-48 bg-white rounded-[32px] border-8 border-gray-50 shadow-2xl flex items-center justify-center shrink-0 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col items-center relative z-10">
                   <div className="h-32 w-20 bg-primary/10 rounded-2xl relative border-2 border-primary/20 p-2">
                      <div className="absolute top-4 left-0 w-full h-6 bg-primary/30 rounded-t-lg" />
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[85%] h-14 bg-white shadow-xl flex items-center justify-center text-[10px] font-black text-primary rounded-md border border-primary/10">IQBAL</div>
                   </div>
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-4xl font-black text-[#2D3436] flex items-center gap-3 tracking-tighter">
                      {selectedMed.name}
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </h2>
                    <p className="text-xl text-muted-foreground font-black uppercase tracking-widest">{selectedMed.company}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-[#2D3436] font-black h-12 px-8 shadow-xl hover:bg-gray-800 transition-all active:scale-95">ORDER NOW (F2)</Button>
                    <Button variant="outline" className="h-12 w-12 border-gray-200 shadow-lg hover:bg-primary/5 hover:text-primary transition-all"><Settings className="h-5 w-5" /></Button>
                  </div>
                </div>

                <div className="flex gap-4">
                   <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/20 shadow-sm">
                     <Pill className="h-4 w-4" /> {selectedMed.category} ({selectedMed.potency})
                   </div>
                   <div className="flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-black uppercase tracking-widest border border-green-200 shadow-sm">
                     <Barcode className="h-4 w-4" /> AUTO-SYNC ON
                   </div>
                </div>

                <div className="grid grid-cols-6 gap-6 py-6 border-y border-gray-100">
                  <DetailBox label="PACKING" value={selectedMed.pack} />
                  <DetailBox label="SHELF LOC" value={selectedMed.location} />
                  <DetailBox label="MRP RATE" value={`₹${selectedMed.mrp}`} />
                  <DetailBox label="NET COST" value={`₹${selectedMed.netRate}`} highlight />
                  <DetailBox label="POS RATE" value={`₹${selectedMed.saleRate}`} />
                  <DetailBox label="AVAILABLE" value={`${selectedMed.stock} PACKS`} highlight />
                </div>
              </div>
            </div>

            {/* Bottom Tabs Section */}
            <Tabs defaultValue="batches" className="w-full">
              <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 mb-8">
                <TabTrigger value="batches">STOCK BATCHES</TabTrigger>
                <TabTrigger value="purchases">PURCHASE HISTORY</TabTrigger>
                <TabTrigger value="sales">SALES ANALYTICS</TabTrigger>
                <TabTrigger value="timeline">STOCK TIMELINE</TabTrigger>
                <TabTrigger value="substitute">GENERIC SUB</TabTrigger>
                <TabTrigger value="distributor">DISTRIBUTORS</TabTrigger>
              </TabsList>
              
              <TabsContent value="batches">
                <div className="rounded-[20px] border border-gray-200 overflow-hidden shadow-2xl">
                  <Table>
                    <TableHeader className="bg-gray-50/80">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-black text-[11px] text-[#2D3436] uppercase tracking-wider h-14 pl-6">BATCH REFERENCE</TableHead>
                        <TableHead className="font-black text-[11px] text-[#2D3436] uppercase tracking-wider">UNIT PACK</TableHead>
                        <TableHead className="font-black text-[11px] text-[#2D3436] uppercase tracking-wider">EXP DATE</TableHead>
                        <TableHead className="font-black text-[11px] text-[#2D3436] uppercase tracking-wider">STATUS</TableHead>
                        <TableHead className="font-black text-[11px] text-[#2D3436] uppercase tracking-wider text-right">MRP</TableHead>
                        <TableHead className="font-black text-[11px] text-[#2D3436] uppercase tracking-wider text-right">NET RATE</TableHead>
                        <TableHead className="font-black text-[11px] text-[#2D3436] uppercase tracking-wider text-right pr-6">POS RATE</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="h-20 hover:bg-primary/5 transition-colors cursor-pointer">
                        <TableCell className="font-black text-sm pl-6">
                          IQ-99821-B
                          <br/><span className="text-[10px] text-muted-foreground font-bold tracking-widest">36M LIFE CYCLE</span>
                        </TableCell>
                        <TableCell className="text-sm font-bold text-muted-foreground">{selectedMed.pack}</TableCell>
                        <TableCell className="text-sm font-black text-destructive">{selectedMed.expiry}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-4 py-1 font-black text-[10px]">ACTIVE STOCK</Badge>
                        </TableCell>
                        <TableCell className="text-right font-black">₹{selectedMed.mrp}</TableCell>
                        <TableCell className="text-right font-black text-primary">₹{selectedMed.netRate}</TableCell>
                        <TableCell className="text-right font-black pr-6">₹{selectedMed.saleRate}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between items-center mt-8">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest">Print Label (P)</Button>
                    <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest">Export History</Button>
                  </div>
                  <Button className="bg-[#2D3436] text-[10px] font-black uppercase tracking-widest h-10 px-6">+ Create New Batch Entry</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Auto-Hideable Footer Navigation */}
      <footer className={cn(
        "bg-white border-t px-6 py-1.5 flex items-center justify-between sticky bottom-0 z-40 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] shadow-[0_-4px_10px_rgba(0,0,0,0.03)] transition-transform duration-500 ease-in-out",
        isFooterVisible ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="flex items-center gap-6">
           <button className="flex items-center gap-2 hover:text-primary transition-colors"><ChevronLeft className="h-4 w-4" /> PREV PRODUCT (CTRL+L)</button>
           <Separator orientation="vertical" className="h-4" />
           <span className="text-primary">System: Clinical v4.2.0</span>
        </div>
        <div className="flex gap-12">
           <span className="flex items-center gap-1.5">New Billing - <span className="text-primary font-black bg-primary/5 px-1.5 py-0.5 rounded-sm">F2</span></span>
           <span className="flex items-center gap-1.5">Settings - <span className="text-primary font-black bg-primary/5 px-1.5 py-0.5 rounded-sm">F4</span></span>
           <span className="flex items-center gap-1.5">Print Rx - <span className="text-primary font-black bg-primary/5 px-1.5 py-0.5 rounded-sm">CTRL+P</span></span>
        </div>
        <div className="flex items-center gap-6">
           <button className="flex items-center gap-2 hover:text-primary transition-colors">NEXT PRODUCT (CTRL+R) <ChevronRight className="h-4 w-4" /></button>
           <Separator orientation="vertical" className="h-4" />
           <button 
              onClick={() => setIsFooterVisible(false)}
              className="hover:text-primary transition-colors p-1"
           >
              <ChevronDown className="h-4 w-4" />
           </button>
        </div>
      </footer>
      
      {/* Floating Restore Button */}
      {!isFooterVisible && (
        <button 
          onClick={() => setIsFooterVisible(true)}
          className="fixed bottom-4 right-4 z-50 bg-white border shadow-lg rounded-full p-2 hover:text-primary transition-all text-muted-foreground animate-in fade-in slide-in-from-bottom-2"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function SidebarItem({ icon: Icon, label, collapsed, hasSub, badge }: any) {
  return (
    <div className="group px-4 py-3.5 cursor-pointer hover:bg-gray-800 transition-all flex items-center relative active:bg-black">
      <Icon className={cn("h-5 w-5 shrink-0 transition-colors", collapsed ? "mx-auto" : "mr-4 group-hover:text-primary")} />
      {!collapsed && (
        <>
          <span className="text-xs font-black uppercase tracking-widest flex-1 truncate group-hover:text-white">{label}</span>
          {badge && <span className="bg-destructive text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-black animate-pulse shadow-lg">{badge}</span>}
          <div className="flex gap-1">
            {label.includes("Dashboard") && <span className="text-[10px] text-amber-500">💎</span>}
            {hasSub && <ChevronRight className="h-3 w-3 opacity-30 group-hover:opacity-100 transition-opacity" />}
          </div>
        </>
      )}
      {collapsed && label.includes("Dashboard") && <div className="absolute top-2 right-2 text-[8px]">💎</div>}
    </div>
  );
}

function DetailBox({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase opacity-70">{label}</span>
      <span className={cn(
        "text-sm font-black tracking-tight",
        highlight ? "text-primary text-base" : "text-[#2D3436]"
      )}>{value}</span>
    </div>
  );
}

function TabTrigger({ value, children }: { value: string, children: React.ReactNode }) {
  return (
    <TabsTrigger 
      value={value} 
      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none h-14 px-8 text-[11px] font-black tracking-widest text-muted-foreground hover:text-primary transition-all uppercase"
    >
      {children}
    </TabsTrigger>
  );
}
