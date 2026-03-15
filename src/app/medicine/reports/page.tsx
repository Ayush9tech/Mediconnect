
"use client";

import React from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { 
  Download, 
  Calendar as CalendarIcon, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Calculator,
  ReceiptText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const SALES_DATA = [
  { name: "Mon", revenue: 4200, profit: 1200, gst: 504 },
  { name: "Tue", revenue: 3800, profit: 1100, gst: 456 },
  { name: "Wed", revenue: 5600, profit: 1800, gst: 672 },
  { name: "Thu", revenue: 4800, profit: 1400, gst: 576 },
  { name: "Fri", revenue: 6200, profit: 2100, gst: 744 },
  { name: "Sat", revenue: 7500, profit: 2500, gst: 900 },
  { name: "Sun", revenue: 3200, profit: 900, gst: 384 },
];

const RECENT_INVOICES = [
  { id: "INV-8821", patient: "John Doe", items: 4, total: 450, tax: 54, status: "Paid", time: "10 mins ago" },
  { id: "INV-8820", patient: "Alice Smith", items: 2, total: 1200, tax: 144, status: "Paid", time: "1 hour ago" },
  { id: "INV-8819", patient: "Walk-in Customer", items: 1, total: 150, tax: 18, status: "Paid", time: "2 hours ago" },
  { id: "INV-8818", patient: "Michael Ross", items: 6, total: 2450, tax: 294, status: "Refunded", time: "Yesterday" },
  { id: "INV-8817", patient: "Eleanor Vance", items: 3, total: 850, tax: 102, status: "Paid", time: "Yesterday" },
];

export default function MedicineReportsPage() {
  const { toast } = useToast();

  const handleReportAction = (title: string) => {
    toast({
      title: `Compiling ${title}`,
      description: "The system is auditing clinical records for this report. Exporting now...",
    });
  };

  const handleGSTDownload = () => {
    toast({
      title: "GSTR-1 Simulation",
      description: "Generating clinical GST summary for the current filing period.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-primary">Sales & Revenue Intelligence</h2>
            <p className="text-muted-foreground">Comprehensive analytics for medicine sales, GST compliance, and profit tracking.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="shadow-sm">
              <CalendarIcon className="mr-2 h-4 w-4" /> This Week
            </Button>
            <Button className="bg-primary shadow-lg" onClick={() => handleReportAction("Comprehensive PDF Report")}>
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none ring-1 ring-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between bg-muted/10 border-b">
                <div>
                  <CardTitle className="text-lg">Revenue vs Profit Timeline</CardTitle>
                  <CardDescription>Daily financial performance for the current week.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white border-primary text-primary">REVENUE</Badge>
                  <Badge variant="outline" className="bg-white border-accent text-accent">PROFIT</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SALES_DATA}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} dx={-10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      <Area type="monotone" dataKey="profit" stroke="hsl(var(--accent))" strokeWidth={3} fillOpacity={1} fill="url(#colorProf)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none ring-1 ring-border shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/10 border-b">
                <CardTitle className="text-lg">Detailed Transaction Ledger</CardTitle>
                <CardDescription>Real-time audit of all sales and invoices generated.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Invoice Ref</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Tax (GST)</TableHead>
                      <TableHead>Total Amt</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RECENT_INVOICES.map((inv) => (
                      <TableRow key={inv.id} className="cursor-pointer group">
                        <TableCell className="font-mono font-bold text-primary">{inv.id}</TableCell>
                        <TableCell className="font-medium">{inv.patient}</TableCell>
                        <TableCell>{inv.items} items</TableCell>
                        <TableCell className="text-muted-foreground">₹{inv.tax}</TableCell>
                        <TableCell className="font-black">₹{inv.total}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={inv.status === "Paid" ? "default" : "destructive"} 
                            className={`text-[10px] px-2 py-0 ${inv.status === "Paid" ? "bg-green-500 hover:bg-green-600" : ""}`}
                          >
                            {inv.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none ring-1 ring-border shadow-sm">
              <CardHeader className="bg-muted/10 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" /> Specialized Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <ReportAction 
                  title="GSTR-1 Monthly Summary" 
                  description="Export full tax details for GST filing." 
                  onClick={() => handleReportAction("GSTR-1 Monthly Summary")}
                />
                <ReportAction 
                  title="Expiry Tracking Report" 
                  description="Upcoming medicine batch expiries." 
                  onClick={() => handleReportAction("Expiry Tracking Report")}
                />
                <ReportAction 
                  title="Supplier Payment Ledger" 
                  description="Outward payments and purchase history." 
                  onClick={() => handleReportAction("Supplier Payment Ledger")}
                />
                <ReportAction 
                  title="Store Profitability" 
                  description="Store-wise performance analytics." 
                  onClick={() => handleReportAction("Store Profitability")}
                />
                <ReportAction 
                  title="Audit Logs" 
                  description="Complete clinical transaction audit trail." 
                  onClick={() => handleReportAction("Audit Logs")}
                />
              </CardContent>
            </Card>

            <Card className="bg-[#2D3436] text-white border-none shadow-xl overflow-hidden relative">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-80">Quick GST View</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs opacity-70"><span>Total Taxable Amt</span><span>₹31,064.00</span></div>
                  <div className="flex justify-between text-xs opacity-70"><span>Output CGST (6%)</span><span>₹2,118.00</span></div>
                  <div className="flex justify-between text-xs opacity-70"><span>Output SGST (6%)</span><span>₹2,118.00</span></div>
                  <div className="h-px bg-white/20 my-4" />
                  <div className="flex justify-between font-black text-lg text-primary-foreground">
                    <span>Total Tax Liability</span>
                    <span>₹4,236.00</span>
                  </div>
                </div>
                <Button variant="secondary" className="w-full font-black text-[#2D3436]" onClick={handleGSTDownload}>
                  DOWNLOAD GSTR-1
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ReportStatCard 
            title="Total Revenue" 
            value="₹35,300" 
            sub="₹4,240 tax included"
            icon={TrendingUp}
            trend="+12.5%"
            positive
          />
          <ReportStatCard 
            title="GST Collected" 
            value="₹4,236" 
            sub="GSTR-1 Simulation"
            icon={Calculator}
            trend="+8.2%"
            positive
          />
          <ReportStatCard 
            title="Avg. Transaction" 
            value="₹840" 
            sub="Per clinical invoice"
            icon={ReceiptText}
            trend="-2.1%"
            positive={false}
          />
          <ReportStatCard 
            title="Profit Margin" 
            value="34%" 
            sub="Net store profit"
            icon={TrendingUp}
            trend="+4.5%"
            positive
          />
        </div>
      </main>
    </div>
  );
}

function ReportStatCard({ title, value, sub, icon: Icon, trend, positive }: any) {
  return (
    <Card className="border-none ring-1 ring-border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-lg bg-primary/10 text-primary shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
          <div className={`flex items-center gap-1 text-[10px] font-bold ${positive ? 'text-green-600' : 'text-destructive'}`}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</h3>
          <p className="text-3xl font-black font-headline mt-1">{value}</p>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportAction({ title, description, onClick }: { title: string, description: string, onClick?: () => void }) {
  return (
    <div 
      className="p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 cursor-pointer transition-all group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm text-primary group-hover:text-primary transition-colors">{title}</span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
      </div>
      <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}
