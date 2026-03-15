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
  Menu,
  X,
  Plus,
  Save,
  RefreshCw,
  Trash2,
  DatabaseZap,
  ArrowRight,
  Loader2,
  FileBarChart,
  HandCoins,
  Keyboard,
  BellPlus,
  Tags
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, serverTimestamp, query } from "firebase/firestore";
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";

export default function MedicineInventoryPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeView, setActiveView] = useState<'dashboard' | 'master-entry'>('dashboard');

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
    });
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
      {/* DESKTOP SIDEBAR - LEFT */}
      <aside className="hidden lg:flex w-[180px] bg-[#2D3436] flex-col shrink-0 border-r border-gray-700">
        <div className="flex-1 overflow-y-auto">
          <SidebarItem icon={Menu} label="Master Entry" active={activeView === 'master-entry'} onClick={() => setActiveView('master-entry')} />
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
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Administrator</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-16 md:h-20 bg-[#0A192F] flex items-center justify-between px-3 md:px-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white h-10 w-10 hover:bg-white/10">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] bg-[#2D3436] p-0 border-r-gray-700">
                  <SheetHeader className="p-4 border-b border-gray-700">
                    <SheetTitle className="text-white text-lg flex items-center gap-2">
                      <div className="h-8 w-8 bg-white rounded p-1 shadow-inner"><img src="https://picsum.photos/seed/med-logo/100/100" alt="Logo" /></div>
                      Master Menu
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto">
                    <SidebarItem icon={Menu} label="Master Entry" active={activeView === 'master-entry'} onClick={() => { setActiveView('master-entry'); }} />
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
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1 group/nav min-w-[8px] h-10">
                <Button variant="ghost" size="icon" onClick={() => { setActiveView('dashboard'); router.push("/dashboard"); }} className="text-white hover:bg-white/10 h-7 w-7" title="Home"><Home className="h-4 w-4" /></Button>
                <div className="flex items-center gap-1.5 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center border border-white/20 rounded-full p-0.5 bg-black/20">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10 h-6 w-6 rounded-full" title="Go Back"><ChevronLeft className="h-3 w-3" /></Button>
                    <div className="w-[1px] h-3 bg-white/20 mx-0.5" />
                    <Button variant="ghost" size="icon" onClick={() => router.forward()} className="text-white hover:bg-white/10 h-6 w-6 rounded-full" title="Go Forward"><ChevronRight className="h-3 w-3" /></Button>
                  </div>
                </div>
                <div className="h-9 w-9 bg-white rounded-md flex items-center justify-center p-1 overflow-hidden ml-2 shadow-inner"><img src="https://picsum.photos/seed/med-logo/100/100" alt="Logo" className="object-contain" /></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-[#2ed573] text-sm md:text-2xl font-black tracking-tight leading-none uppercase drop-shadow-[0_0_8px_rgba(46,213,115,0.3)]">
              {formatDate(currentTime)} {formatTime(currentTime)}
            </div>
            <div className="text-[#2ed573] text-[9px] md:text-sm font-bold opacity-80 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1">
              {formatDay(currentTime)}
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            <div className="hidden xl:flex items-center gap-2">
              <UtilityIcon icon={Lock} />
              <UtilityIcon icon={Calculator} />
              <UtilityIcon icon={FileBarChart} />
              <UtilityIcon icon={HandCoins} />
              <UtilityIcon icon={Percent} />
              <UtilityIcon icon={Keyboard} />
              <UtilityIcon icon={Monitor} />
              <UtilityIcon icon={BellPlus} />
              <UtilityIcon icon={Info} />
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-red-600 hover:bg-red-700 text-white rounded-md h-9 w-9 md:h-10 md:w-10 shadow-lg border border-red-500/50"
                onClick={() => { setActiveView('dashboard'); router.push("/dashboard"); }}
                title="Exit Dashboard"
              >
                <Power className="h-4 w-4 md:h-5 md:w-5 stroke-[3]" />
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="bg-gray-600 hover:bg-gray-700 text-white rounded-md h-9 w-9 md:h-10 md:w-10 shadow-lg border border-white/20"
                    title="Action Menu"
                  >
                    <Settings className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-[#2D3436] border-l-gray-700 p-0 text-white w-[200px] overflow-y-auto">
                  <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-sm font-headline font-bold text-white tracking-tight italic uppercase">Action Menu</h2>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-6 w-6 border border-white/20">
                          <X className="h-3 w-3" />
                        </Button>
                      </SheetClose>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <ActionMenuButton icon={ShoppingCart} label="Sale" />
                      <ActionMenuButton icon={Package} label="Purchase" />
                      <ActionMenuButton icon={Receipt} label="Receipt" />
                      <ActionMenuButton icon={Wallet} label="Payment" />
                      <ActionMenuButton icon={UserPlus} label="Customer" />
                      <ActionMenuButton icon={Truck} label="Supplier" />
                      <ActionMenuButton icon={Box} label="Product" />
                      <ActionMenuButton icon={Banknote} label="Expense" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        {/* HERO OR FORM SECTION */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-white p-2">
            {activeView === 'dashboard' ? (
              <div className="h-full relative bg-gradient-to-br from-[#0984e3] to-[#00a8ff] overflow-hidden flex flex-col items-center justify-center p-4 rounded-lg shadow-inner">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='104' viewBox='0 0 60 104' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 104V88h-2L30 74 2 88H0v16h60zM30 44L0 30V0h60v30L30 44z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  backgroundSize: '60px 104px'
                }}></div>
                <div className="relative z-10 text-center space-y-2 mb-8 md:mb-12 px-4">
                  <h1 className="text-white text-4xl md:text-6xl font-black tracking-tighter drop-shadow-2xl">Pharmacy</h1>
                  <p className="text-white text-lg md:text-3xl font-bold tracking-tight opacity-90 drop-shadow-lg">The backbone of healthcare Services</p>
                </div>
                <div className="relative w-full max-w-4xl h-48 md:h-64 z-10 scale-75 md:scale-100 flex items-center justify-center gap-4">
                  <div className="w-32 h-16 md:w-48 md:h-24 bg-white/90 rounded-full border-4 border-gray-200 flex items-center justify-center rotate-[-15deg] shadow-2xl shrink-0"><span className="text-[#2D3436] font-black text-sm md:text-xl">Med</span></div>
                  <div className="flex wrap items-center justify-center max-w-[200px] md:max-w-lg gap-2 md:gap-4">
                    <Bubble label="Toxicology" size="sm" />
                    <Bubble label="D. Pharma" size="lg" />
                    <Bubble label="M. Pharma." size="lg" />
                    <Bubble label="B. Pharma." size="lg" />
                    <Bubble label="#ihoik" size="sm" />
                  </div>
                  <div className="w-32 h-16 md:w-48 md:h-24 bg-red-600 rounded-full border-4 border-red-700 flex items-center justify-center rotate-[15deg] shadow-2xl shrink-0"><div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-full animate-pulse" /></div>
                </div>
              </div>
            ) : (
              <ProductEntryForm />
            )}
          </main>

          {/* RIGHT ACTION MENU - DESKTOP */}
          <aside className="hidden md:block w-[220px] bg-[#2D3436] border-l border-gray-700 overflow-y-auto shrink-0">
            <div className="space-y-1 p-2">
              <MenuButton label="Sale" shortcut="F1" icon={Tags} />
              <MenuButton label="Purchase" shortcut="F2" icon={Package} />
              <MenuButton label="Receipt" shortcut="F3" icon={HandCoins} />
              <MenuButton label="Payment" shortcut="F4" icon={Wallet} />
              <MenuButton label="Customer" shortcut="F5" icon={UserPlus} />
              <MenuButton label="Supplier" shortcut="F6" icon={Truck} />
              <MenuButton label="Product" shortcut="F7" icon={Box} />
              <MenuButton label="Expense" shortcut="F8" icon={Banknote} />
            </div>
          </aside>
        </div>

        {/* BOTTOM STATUS BAR */}
        <footer className="h-8 bg-[#2ed573] flex items-center justify-between px-4 text-[9px] md:text-[10px] font-black text-white shrink-0 uppercase tracking-wider overflow-hidden">
          <div className="flex gap-4 truncate">
            <span>🟢 Admin : admin</span>
            <span className="hidden sm:inline opacity-60">|</span>
            <span className="hidden sm:inline">Raintech Software Ltd</span>
            <span className="hidden sm:inline opacity-60">|</span>
            <span className="truncate">Support: +91 8606093110</span>
          </div>
          <div className="hidden xs:flex items-center gap-2 whitespace-nowrap">
            <span>{formatDate(currentTime)} {formatTime(currentTime)}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ActionMenuButton({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <Button 
      variant="ghost"
      className="w-full h-8 bg-[#3D4446] hover:bg-[#4D5456] text-white border border-white/5 flex items-center justify-start gap-2 px-2 group transition-all rounded-md"
    >
      <div className="p-1 rounded bg-black/20 group-hover:bg-white/10 transition-colors">
        <Icon className="h-3 w-3 text-white/80" />
      </div>
      <span className="text-[9px] font-bold uppercase tracking-[0.1em]">{label}</span>
    </Button>
  );
}

function ProductEntryForm() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const profileRef = useMemoFirebase(
    () => (user ? doc(firestore, "store_users", user.uid) : null),
    [user, firestore]
  );
  const { data: profile } = useDoc(profileRef);
  const storeId = profile?.storeId || "default-store";

  const categoriesQuery = useMemoFirebase(() => collection(firestore, "categories"), [firestore]);
  const { data: categories } = useCollection(categoriesQuery);

  const medicinesQuery = useMemoFirebase(() => collection(firestore, "medicines"), [firestore]);
  const { data: medicines } = useCollection(medicinesQuery);

  const [formData, setFormData] = useState({
    id: "",
    code: "",
    name: "",
    categoryId: "",
    company: "",
    hsnCode: "",
    description: "",
    purchaseRate: 0,
    reorderLevel: 1,
    mainUnit: "strip",
    alterUnit: "pieces",
    conversionValue: 10,
    discountPercent: 0,
    gstRate: 12,
    taxType: "INCLUSIVE",
    schedule: "h1",
    isActive: true,
    // Opening Stock Batch Info
    qty: 100,
    mrp: 60,
    salesRate: 55,
    batchNo: "",
    mfgDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date().toISOString().split('T')[0],
    barcode: "100001"
  });

  const handleSelectMedicine = (med: any) => {
    setFormData({
      ...formData,
      ...med,
      batchNo: "", // Reset batch for existing product edits
    });
  };

  const handleNew = () => {
    setFormData({
      id: "",
      code: "P-" + Math.floor(1000 + Math.random() * 9000),
      name: "",
      categoryId: categories?.[0]?.id || "",
      company: "",
      hsnCode: "",
      description: "",
      purchaseRate: 0,
      reorderLevel: 1,
      mainUnit: "strip",
      alterUnit: "pieces",
      conversionValue: 10,
      discountPercent: 0,
      gstRate: 12,
      taxType: "INCLUSIVE",
      schedule: "h1",
      isActive: true,
      qty: 100,
      mrp: 60,
      salesRate: 55,
      batchNo: "",
      mfgDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date().toISOString().split('T')[0],
      barcode: "100001"
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.company) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Product Name and Company are required." });
      return;
    }

    setLoading(true);
    const medicineId = formData.id || doc(collection(firestore, "medicines")).id;
    const medicineRef = doc(firestore, "medicines", medicineId);

    const medicineData = {
      id: medicineId,
      code: formData.code,
      name: formData.name,
      categoryId: formData.categoryId,
      company: formData.company,
      hsnCode: formData.hsnCode,
      description: formData.description,
      reorderLevel: formData.reorderLevel,
      mainUnit: formData.mainUnit,
      alterUnit: formData.alterUnit,
      conversionValue: formData.conversionValue,
      discountPercent: formData.discountPercent,
      gstRate: formData.gstRate,
      taxType: formData.taxType,
      schedule: formData.schedule,
      isActive: formData.isActive,
      updatedAt: serverTimestamp(),
    };

    setDocumentNonBlocking(medicineRef, medicineData, { merge: true });

    // If batch info provided, create initial batch
    if (formData.batchNo) {
      const batchId = doc(collection(firestore, "stores", storeId, "batches")).id;
      const batchRef = doc(firestore, "stores", storeId, "batches", batchId);
      
      const batchData = {
        id: batchId,
        medicineId: medicineId,
        batchNumber: formData.batchNo,
        manufacturingDate: formData.mfgDate,
        expiryDate: formData.expiryDate,
        currentStock: formData.qty,
        purchasePrice: formData.purchaseRate,
        mrp: formData.mrp,
        salesRate: formData.salesRate,
        storeId: storeId,
        createdAt: serverTimestamp(),
      };

      setDocumentNonBlocking(batchRef, batchData, { merge: true });
    }

    setLoading(false);
    toast({ title: "Success", description: "Clinical product has been saved/updated." });
    if (!formData.id) handleNew();
  };

  const handleDelete = () => {
    if (!formData.id) return;
    deleteDocumentNonBlocking(doc(firestore, "medicines", formData.id));
    toast({ title: "Deleted", description: "Product removed from catalog." });
    handleNew();
  };

  const filteredMedicines = (medicines || []).filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#F0F0F0] text-[#333] select-none p-1 gap-1">
      {/* Header */}
      <div className="bg-[#2D3436] text-white p-2 text-center shadow-sm rounded-t">
        <h2 className="text-xl font-bold tracking-widest uppercase font-headline">Product Entry</h2>
      </div>

      <div className="flex flex-1 gap-1 min-h-0 overflow-hidden flex-col xl:flex-row">
        {/* Main Form Area */}
        <div className="flex-[3] flex flex-col gap-1 min-w-0">
          <div className="bg-white p-4 border border-gray-300 rounded shadow-sm overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 items-center">
                  <Label className="text-[11px] font-bold uppercase text-gray-500">Product Code :</Label>
                  <Input 
                    className="col-span-2 h-7 bg-gray-50 border-gray-300 text-xs" 
                    value={formData.code} 
                    onChange={e => setFormData({...formData, code: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-3 items-center">
                  <Label className="text-[11px] font-bold uppercase text-gray-500">Product Name :</Label>
                  <Input 
                    className="col-span-2 h-7 border-gray-300 text-xs" 
                    placeholder="e.g. Brufen 400 Tablet" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-3 items-center">
                  <Label className="text-[11px] font-bold uppercase text-gray-500">Category :</Label>
                  <Select value={formData.categoryId} onValueChange={val => setFormData({...formData, categoryId: val})}>
                    <SelectTrigger className="col-span-2 h-7 border-gray-300 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories?.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                      {!categories?.length && <SelectItem value="none">Default Category</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <Label className="text-[11px] font-bold uppercase text-gray-500">Manufacturer :</Label>
                  <Input 
                    className="col-span-2 h-7 border-gray-300 text-xs" 
                    placeholder="e.g. Abbott"
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-3 items-center">
                  <Label className="text-[11px] font-bold uppercase text-gray-500">HSN Code :</Label>
                  <Input 
                    className="col-span-2 h-7 border-gray-300 text-xs" 
                    value={formData.hsnCode}
                    onChange={e => setFormData({...formData, hsnCode: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-3 items-start">
                  <Label className="text-[11px] font-bold uppercase text-gray-500 mt-1">Description :</Label>
                  <Textarea 
                    className="col-span-2 h-24 border-gray-300 text-[10px] resize-none" 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              {/* Right Column - Opening Stock */}
              <div className="border border-gray-200 rounded p-3 relative bg-gray-50/50">
                <span className="absolute -top-2 left-2 bg-[#F0F0F0] px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Opening Stock</span>
                <div className="space-y-2 mt-2">
                  <div className="grid grid-cols-3 items-center">
                    <Label className="text-[11px] text-gray-500">Qty. :</Label>
                    <Input 
                      className="col-span-2 h-7 border-gray-300 text-right font-mono text-xs" 
                      type="number"
                      value={formData.qty}
                      onChange={e => setFormData({...formData, qty: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <Label className="text-[11px] text-gray-500">MRP :</Label>
                    <Input 
                      className="col-span-2 h-7 border-gray-300 text-right font-mono text-xs" 
                      type="number"
                      value={formData.mrp}
                      onChange={e => setFormData({...formData, mrp: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <Label className="text-[11px] text-gray-500">Sales Rate :</Label>
                    <Input 
                      className="col-span-2 h-7 border-gray-300 text-right font-mono text-xs" 
                      type="number"
                      value={formData.salesRate}
                      onChange={e => setFormData({...formData, salesRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <Label className="text-[11px] text-gray-500">Batch No. :</Label>
                    <Input 
                      className="col-span-2 h-7 border-gray-300 text-xs" 
                      value={formData.batchNo}
                      onChange={e => setFormData({...formData, batchNo: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <Label className="text-[11px] text-gray-500">Mfg. Date :</Label>
                    <Input 
                      type="date" 
                      className="col-span-2 h-7 border-gray-300 text-[10px]" 
                      value={formData.mfgDate}
                      onChange={e => setFormData({...formData, mfgDate: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <Label className="text-[11px] text-gray-500">Expiry Date :</Label>
                    <Input 
                      type="date" 
                      className="col-span-2 h-7 border-gray-300 text-[10px]" 
                      value={formData.expiryDate}
                      onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button size="sm" className="bg-[#2ed573] hover:bg-[#26af64] h-7 text-[10px] font-bold gap-1" onClick={handleSave}><Plus className="h-3 w-3" /> Add Batch</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Form Fields (Rates & Units) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3 mt-6 border-t pt-4">
              <div className="space-y-2">
                <div className="grid grid-cols-2 items-center">
                  <Label className="text-[11px] font-bold text-gray-500">Purchase Rate :</Label>
                  <Input 
                    className="h-7 border-gray-300 text-right font-mono text-xs" 
                    type="number"
                    value={formData.purchaseRate}
                    onChange={e => setFormData({...formData, purchaseRate: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="grid grid-cols-2 items-center">
                  <Label className="text-[11px] font-bold text-gray-500">Reorder Point :</Label>
                  <Input 
                    className="h-7 border-gray-300 text-right font-mono text-xs" 
                    type="number"
                    value={formData.reorderLevel}
                    onChange={e => setFormData({...formData, reorderLevel: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="grid grid-cols-2 items-center">
                  <Label className="text-[11px] font-bold text-gray-500">Main Unit :</Label>
                  <Select value={formData.mainUnit} onValueChange={val => setFormData({...formData, mainUnit: val})}>
                    <SelectTrigger className="h-7 border-gray-300 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="strip">STRIP</SelectItem><SelectItem value="vial">VIAL</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 items-center">
                  <Label className="text-[11px] font-bold text-gray-500">Alter Unit :</Label>
                  <Select value={formData.alterUnit} onValueChange={val => setFormData({...formData, alterUnit: val})}>
                    <SelectTrigger className="h-7 border-gray-300 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="pieces">PIECES</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 items-center">
                  <Label className="text-[11px] font-bold text-gray-500">Conversion Value :</Label>
                  <Input 
                    className="h-7 border-gray-300 text-right font-mono text-xs" 
                    type="number"
                    value={formData.conversionValue}
                    onChange={e => setFormData({...formData, conversionValue: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 items-center">
                  <Label className="text-[11px] font-bold text-gray-500">Discount % :</Label>
                  <Input 
                    className="h-7 border-gray-300 text-right font-mono text-xs" 
                    type="number"
                    value={formData.discountPercent}
                    onChange={e => setFormData({...formData, discountPercent: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="grid grid-cols-2 items-center">
                  <Label className="text-[11px] font-bold text-gray-500">GST % :</Label>
                  <Select value={formData.gstRate.toString()} onValueChange={val => setFormData({...formData, gstRate: parseFloat(val)})}>
                    <SelectTrigger className="h-7 border-gray-300 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="12">12</SelectItem><SelectItem value="5">5</SelectItem><SelectItem value="18">18</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-2">
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold text-gray-400 block text-center">CGST %</Label>
                    <Input className="h-7 border-pink-200 bg-pink-50 text-center text-xs text-pink-600 font-bold" value={formData.gstRate / 2} readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold text-gray-400 block text-center">SGST %</Label>
                    <Input className="h-7 border-pink-200 bg-pink-50 text-center text-xs text-pink-600 font-bold" value={formData.gstRate / 2} readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-bold text-gray-400 block text-center">IGST %</Label>
                    <Input className="h-7 border-purple-200 bg-purple-50 text-center text-xs text-purple-600 font-bold" value={formData.gstRate} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-2 items-center pt-2">
                  <Label className="text-[11px] font-bold text-gray-500">Barcode :</Label>
                  <Input 
                    className="h-7 border-green-200 bg-green-50 text-right font-mono text-xs text-green-700 font-bold" 
                    value={formData.barcode}
                    onChange={e => setFormData({...formData, barcode: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Select value={formData.taxType} onValueChange={val => setFormData({...formData, taxType: val})}>
                  <SelectTrigger className="h-7 border-gray-300 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="INCLUSIVE">Inclusive</SelectItem><SelectItem value="EXCLUSIVE">Exclusive</SelectItem></SelectContent>
                </Select>
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-sm shrink-0 uppercase">Schedule of Drugs :</div>
                    <Select value={formData.schedule} onValueChange={val => setFormData({...formData, schedule: val})}>
                      <SelectTrigger className="h-7 border-gray-300 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="h1">H1</SelectItem><SelectItem value="h">H</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Batch Table Area */}
          <div className="bg-white border border-gray-300 rounded overflow-hidden flex-1 min-h-[100px]">
            <table className="w-full text-left text-[10px] font-bold border-collapse">
              <thead className="bg-[#2D3436] text-white">
                <tr>
                  <th className="p-2 border-r border-gray-600 w-[15%]">Qty.</th>
                  <th className="p-2 border-r border-gray-600 w-[15%]">MRP</th>
                  <th className="p-2 border-r border-gray-600 w-[15%]">Sales Rate</th>
                  <th className="p-2 border-r border-gray-600 w-[25%]">Batch No.</th>
                  <th className="p-2 w-[30%]">Mfg. Date</th>
                </tr>
              </thead>
              <tbody className="bg-gray-100">
                {formData.batchNo && (
                  <tr className="border-b border-gray-200">
                    <td className="p-2 border-r border-gray-200">{formData.qty}</td>
                    <td className="p-2 border-r border-gray-200">{formData.mrp}</td>
                    <td className="p-2 border-r border-gray-200">{formData.salesRate}</td>
                    <td className="p-2 border-r border-gray-200">{formData.batchNo}</td>
                    <td className="p-2">{formData.mfgDate}</td>
                  </tr>
                )}
                {!formData.batchNo && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-400 italic">No batch info added for this product yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side - Medicine List & Actions */}
        <div className="w-full xl:w-[350px] flex flex-col gap-1 shrink-0">
          {/* Action Buttons */}
          <div className="bg-white border border-gray-300 p-2 rounded shadow-sm flex flex-col gap-1">
            <ERPActionButton icon={Plus} label="New" color="#3D29A3" onClick={handleNew} />
            <ERPActionButton icon={Save} label="Save" color="#2D3436" onClick={handleSave} disabled={loading} />
            <ERPActionButton icon={RefreshCw} label="Update" color="#2ed573" onClick={handleSave} disabled={!formData.id || loading} />
            <ERPActionButton icon={Trash2} label="Delete" color="#ff4757" onClick={handleDelete} disabled={!formData.id} />
            <ERPActionButton icon={DatabaseZap} label="Get Data" color="#ffa502" />
          </div>

          {/* Search Medicine List */}
          <div className="bg-white border border-gray-300 rounded shadow-sm flex-1 flex flex-col min-h-[300px] xl:min-h-0 relative">
            <span className="absolute -top-2 left-2 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider z-10">Medicine List :</span>
            <div className="p-3 pt-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Label className="text-[10px] font-bold text-gray-500 whitespace-nowrap">Search Medicine Name :</Label>
                <Input 
                  className="h-7 text-xs border-gray-300" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500"><ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-gray-50">
              <table className="w-full text-left text-[10px] font-bold border-collapse">
                <thead>
                  <tr className="text-white">
                    <th className="p-2 bg-[#5282E0] w-[40%]">Medicine Name</th>
                    <th className="p-2 bg-[#8e44ad] w-[30%]">Manufacturer</th>
                    <th className="p-2 bg-[#c0392b] w-[30%]">Prescription</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map((med) => (
                    <MedicineListItem 
                      key={med.id} 
                      name={med.name} 
                      manufacturer={med.company} 
                      active={formData.id === med.id} 
                      onClick={() => handleSelectMedicine(med)}
                    />
                  ))}
                  {!filteredMedicines.length && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-400">No medicines found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ERPActionButton({ icon: Icon, label, color, onClick, disabled }: { icon: any, label: string, color: string, onClick?: () => void, disabled?: boolean }) {
  return (
    <Button 
      variant="outline" 
      disabled={disabled}
      className="w-full justify-start gap-3 h-12 border-gray-300 hover:bg-gray-50 group disabled:opacity-50"
      style={{ borderLeftWidth: '4px', borderLeftColor: color }}
      onClick={onClick}
    >
      <div className="p-1.5 rounded bg-gray-100 group-hover:bg-white transition-colors shadow-sm">
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <span className="text-sm font-black uppercase tracking-widest text-gray-700">{label}</span>
    </Button>
  );
}

function MedicineListItem({ name, manufacturer, active, onClick }: { name: string, manufacturer: string, active?: boolean, onClick: () => void }) {
  return (
    <tr 
      onClick={onClick}
      className={cn(
        "border-b border-white cursor-pointer hover:opacity-80 transition-opacity",
        active ? "bg-[#fff3cd] text-[#856404]" : "bg-white text-gray-600"
      )}
    >
      <td className="p-2 border-r border-white">{active && <span className="mr-1">▶</span>}{name}</td>
      <td className="p-2 border-r border-white">{manufacturer}</td>
      <td className="p-2 italic">Prescription Req.</td>
    </tr>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-b border-gray-700/50 group",
        active ? "bg-[#0984e3] text-white" : "hover:bg-white/10"
      )}
    >
      <div className={cn(
        "p-1.5 rounded transition-all",
        active ? "bg-white text-[#0984e3]" : "bg-gray-700/50 text-gray-400 group-hover:text-white group-hover:bg-[#0984e3]"
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <span className={cn(
        "text-[11px] font-bold uppercase tracking-wide",
        active ? "text-white" : "text-gray-400 group-hover:text-white"
      )}>{label}</span>
    </div>
  );
}

function UtilityIcon({ icon: Icon, badge }: { icon: any, badge?: string }) {
  return (
    <div className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded border border-white/20 cursor-pointer hover:bg-white/10 relative shrink-0">
      <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
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
      "bg-white rounded-full flex items-center justify-center font-black text-[#3D29A3] shadow-xl border-4 border-gray-100",
      size === 'lg' ? "h-14 w-14 md:h-20 md:w-20 text-[9px] md:text-xs" : "h-10 w-10 md:h-14 md:w-14 text-[7px] md:text-[8px]"
    )}>
      <span className="truncate px-1">{label}</span>
    </div>
  );
}

function MenuButton({ label, shortcut, icon: Icon }: { label: string, shortcut: string, icon: any }) {
  return (
    <div className="flex items-center justify-between bg-white/10 rounded border border-white/5 p-2 md:p-3 cursor-pointer hover:bg-[#0984e3] hover:border-[#0984e3] group transition-all">
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 md:h-8 md:w-8 rounded bg-black/20 flex items-center justify-center group-hover:bg-white/20">
          <Icon className="h-3 w-3 md:h-4 md:w-4 text-white" />
        </div>
        <span className="text-white font-black text-[10px] md:text-xs uppercase tracking-wider">{label}</span>
      </div>
      <span className="hidden sm:inline text-[9px] md:text-[10px] font-black text-white/40 group-hover:text-white">{shortcut}</span>
    </div>
  );
}
