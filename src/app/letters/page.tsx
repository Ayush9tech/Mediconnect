
"use client";

import React, { useState, useEffect } from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, FileText, MoreVertical, Filter, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useUser } from "@/firebase/provider";
import { getDoctorProfile, trackActivity } from "@/lib/auth";

export default function LettersPage() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [letters, setLetters] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      getDoctorProfile(user.uid).then(profile => {
        if (profile) {
          // Load letters from profile metadata or use defaults
          const STORAGE_KEY = 'mediconnect_letters';
          const storageLetters = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          const userLetters = storageLetters.filter((l: any) => l.doctorId === user.uid);
          setLetters(userLetters.length > 0 ? userLetters : []);
        }
      }).catch(error => {
        console.error("Error loading profile:", error);
        // Try loading from localStorage
        const STORAGE_KEY = 'mediconnect_letters';
        const storageLetters = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const userLetters = storageLetters.filter((l: any) => l.doctorId === user?.uid);
        setLetters(userLetters);
      });
    }
  }, [user]);

  const filteredLetters = letters.filter(l => 
    l.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNewLetter = async () => {
    if (user) {
      await trackActivity(user.uid, 'create-letter', `New consultation letter created`, 'Started creating a new consultation letter');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-primary">My Consultation Letters</h2>
            <p className="text-muted-foreground">Access and manage your drafted and finalized clinical letters.</p>
          </div>
          <Button asChild className="bg-primary" onClick={handleCreateNewLetter}>
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
            {filteredLetters.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <FileText className="h-8 w-8 text-primary/40" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">No letters yet</p>
                  <p className="text-xs text-muted-foreground/70">Create your first consultation letter to get started</p>
                </div>
                <Button asChild className="mt-4">
                  <Link href="/letters/new"><Plus className="mr-2 h-4 w-4" /> Create New Letter</Link>
                </Button>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
