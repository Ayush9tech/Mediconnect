
"use client";

import React from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Eye, Share2, FilePlus, ShieldCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AUDIT_LOG = [
  { id: 1, action: "Letter Viewed", detail: "Dr. Johnson viewed 'Referral for John Doe'", time: "2025-02-25 14:30", type: "view" },
  { id: 2, action: "Record Shared", detail: "Shared 'Consultation Note' with Dr. Sarah Smith", time: "2025-02-25 11:15", type: "share" },
  { id: 3, action: "New Draft", detail: "Created new letter for Alice Thompson", time: "2025-02-24 16:45", type: "create" },
  { id: 4, action: "Login Success", detail: "System access from Terminal 04", time: "2025-02-24 08:00", type: "security" },
  { id: 5, action: "Record Shared", detail: "Shared 'Imaging Results' with Dr. Michael Chen", time: "2025-02-23 15:20", type: "share" },
];

export default function SharingHistoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-headline font-bold text-primary">Full Audit Log</h2>
            <p className="text-muted-foreground">Detailed activity and sharing history for compliance tracking.</p>
          </div>
          <Badge variant="outline" className="flex gap-1.5 py-1 px-3">
            <ShieldCheck className="h-3 w-3 text-green-600" /> Secure Logging Enabled
          </Badge>
        </div>

        <Card className="border-none ring-1 ring-border shadow-sm">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-primary" /> Activity History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Event Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {AUDIT_LOG.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground font-mono">{log.time}</TableCell>
                    <TableCell className="font-semibold">{log.action}</TableCell>
                    <TableCell className="text-sm">{log.detail}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        {log.type === 'view' && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none"><Eye className="h-3 w-3 mr-1" /> View</Badge>}
                        {log.type === 'share' && <Badge className="bg-accent/10 text-accent hover:bg-accent/10 border-none"><Share2 className="h-3 w-3 mr-1" /> Share</Badge>}
                        {log.type === 'create' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none"><FilePlus className="h-3 w-3 mr-1" /> Create</Badge>}
                        {log.type === 'security' && <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none"><ShieldCheck className="h-3 w-3 mr-1" /> Security</Badge>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
