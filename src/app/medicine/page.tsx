
"use client";

import React from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Pill, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  AlertTriangle, 
  Plus, 
  ArrowUpRight,
  ClipboardList,
  Wallet,
  TrendingUp,
  Boxes
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MedicineDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-primary">Homeopathic Store Dashboard</h2>
            <p className="text-muted-foreground">Medicine management, real-time stock tracking, and sales analytics.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-primary shadow-lg">
              <Link href="/medicine/inventory">
                <Plus className="mr-2 h-4 w-4" /> Add New Medicine
              </Link>
            </Button>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent/5" asChild>
              <Link href="/medicine/reports">
                <TrendingUp className="mr-2 h-4 w-4" /> Full Sales Report
              </Link>
            </Button>
          </div>
        </div>

        {/* Analytics Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Stock Value" 
            value="₹4,28,450" 
            icon={Wallet} 
            trend="Updated 5m ago"
            onClick={() => router.push("/medicine/inventory")}
          />
          <StatCard 
            title="Today's Sales" 
            value="₹12,450" 
            icon={ShoppingCart} 
            trend="+15% from yesterday"
            onClick={() => router.push("/medicine/reports")}
          />
          <StatCard 
            title="Low Stock Alerts" 
            value="8 Items" 
            icon={AlertTriangle} 
            trend="Reorder suggested"
            highlight
            onClick={() => router.push("/medicine/inventory")}
          />
          <StatCard 
            title="Medicine Catalog" 
            value="1,248" 
            icon={Boxes} 
            trend="12 Categories"
            onClick={() => router.push("/medicine/inventory")}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none ring-1 ring-border shadow-sm">
              <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Core Management Modules</CardTitle>
                  <CardDescription>Select a module to manage your clinical store operations.</CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold bg-white">PRO ENABLED</Badge>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ModuleCard 
                    title="Medicine Inventory" 
                    desc="Add, edit, and track homeopathic medicines by potency (30C, 200C, 1M), company, and category."
                    icon={Package}
                    href="/medicine/inventory"
                  />
                  <ModuleCard 
                    title="Sales & Invoicing" 
                    desc="Generate GST-compliant invoices and manage customer sales records with high-speed POS."
                    icon={ShoppingCart}
                    href="/medicine/sales"
                  />
                  <ModuleCard 
                    title="Stock Transactions" 
                    desc="Manage stock-in/out, batch transfers, and inventory adjustments with full audit logs."
                    icon={ArrowUpRight}
                    href="/medicine/transactions"
                  />
                  <ModuleCard 
                    title="Supplier Directory" 
                    desc="Maintain records of medicine suppliers, contact history, and purchase orders."
                    icon={Users}
                    href="/medicine/suppliers"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none ring-1 ring-border shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Sales Transactions</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs font-bold text-primary" onClick={() => router.push("/medicine/reports")}>VIEW ALL</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {[
                    { id: "INV-8821", patient: "John Doe", amount: "₹450", date: "10 mins ago", method: "UPI" },
                    { id: "INV-8820", patient: "Alice Smith", amount: "₹1,200", date: "1 hour ago", method: "Cash" },
                    { id: "INV-8819", patient: "Walk-in Customer", amount: "₹150", date: "2 hours ago", method: "Cash" },
                  ].map((sale) => (
                    <div key={sale.id} className="p-4 flex items-center justify-between hover:bg-muted/30 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                          <ClipboardList className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{sale.id} - {sale.patient}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{sale.date} • {sale.method}</p>
                        </div>
                      </div>
                      <p className="font-black text-primary text-lg">{sale.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none ring-1 ring-border shadow-sm">
              <CardHeader className="bg-muted/10 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" /> Reports & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <ReportLink title="Daily Sales Summary" onClick={() => router.push("/medicine/reports")} />
                <ReportLink title="Monthly Stock Statement" onClick={() => router.push("/medicine/reports")} />
                <ReportLink title="GST GSTR-1 Summary" onClick={() => router.push("/medicine/reports")} />
                <ReportLink title="Expiry Alerts Report" onClick={() => router.push("/medicine/reports")} />
                <ReportLink title="Purchase Ledger" onClick={() => router.push("/medicine/reports")} />
                <Button variant="outline" className="w-full mt-4 font-bold" asChild>
                  <Link href="/medicine/reports">Access Reporting Hub</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Pill className="h-24 w-24" />
              </div>
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-80">Quick Stock Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs leading-relaxed opacity-90">
                  Instantly locate any medicine in your 100,000+ item database. Search by potency, batch, or location.
                </p>
                <Button variant="secondary" className="w-full font-black text-primary" asChild>
                  <Link href="/medicine/inventory">OPEN INVENTORY</Link>
                </Button>
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
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg border-none ring-1 ring-border group ${highlight ? "ring-2 ring-destructive/20 bg-destructive/5" : "hover:ring-primary/40"}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${highlight ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"} group-hover:bg-primary group-hover:text-white transition-all shadow-sm`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{trend}</span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</h3>
          <p className="text-3xl font-black font-headline mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ModuleCard({ title, desc, icon: Icon, href }: any) {
  return (
    <Link href={href}>
      <Card className="hover:border-primary/50 transition-all cursor-pointer group hover:shadow-lg border-none ring-1 ring-border h-full bg-white">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm shrink-0">
              <Icon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors font-headline">{title}</h3>
              <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ReportLink({ title, onClick }: { title: string, onClick?: () => void }) {
  return (
    <div 
      className="flex items-center justify-between text-sm p-3 hover:bg-muted rounded-md cursor-pointer transition-all group border border-transparent hover:border-border"
      onClick={onClick}
    >
      <span className="font-bold text-muted-foreground group-hover:text-primary transition-colors">{title}</span>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
    </div>
  );
}

function Badge({ variant = "default", className, children }: any) {
  const variants: any = {
    default: "bg-primary text-white",
    outline: "border border-border text-muted-foreground",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
