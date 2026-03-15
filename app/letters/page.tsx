
"use client";

import React, { useState } from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, FileText, MoreVertical, Filter, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const LETTERS = [
  { id: "L001", patient: "Alice Thompson", subject: "Post-op Follow-up", date: "2025-02-12", status: "Finalized", doctor: "Dr. Julian Vane" },
  { id: "L002", patient: "Robert Miller", subject: "Cardiology Referral", date: "2025-02-10", status: "Draft", doctor: "Dr. Julian Vane" },
  { id: "L003", patient: "Sarah Jenkins", subject: "Dermatology Consultation", date: "2025-02-05", status: "Shared", doctor: "Dr. Smith" },
  { id: "L004", patient: "Michael Chen", subject: "Neurology Update", date: "2025-02-14", status: "Finalized", doctor: "Dr. Julian Vane" },
];

export default function LettersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLetters = LETTERS.filter(l => 
    l.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-primary">My Consultation Letters</h2>
            <p className="text-muted-foreground">Access and manage your drafted and finalized clinical letters.</p>
          </div>
          <Button asChild className="bg-primary">
            <Link href="/letters/new"><Plus className="mr-2 h-4 w-4" /> Create New Letter</Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by patient or subject..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <span className="text-xs text-muted-foreground">{filteredLetters.length} letters found</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLetters.map((letter) => (
                  <TableRow key={letter.id} className="group">
                    <TableCell className="font-mono text-xs font-bold text-primary">{letter.id}</TableCell>
                    <TableCell className="font-medium">{letter.patient}</TableCell>
                    <TableCell>{letter.subject}</TableCell>
                    <TableCell>{letter.date}</TableCell>
                    <TableCell>
                      <Badge variant={letter.status === "Draft" ? "secondary" : "default"} className={letter.status === "Shared" ? "bg-accent" : ""}>
                        {letter.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <FileText className="h-4 w-4" /> View/Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Download className="h-4 w-4" /> Export PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-primary font-medium">Share Record</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
