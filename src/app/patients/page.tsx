"use client";

import React, { useState, useEffect } from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, MoreVertical, FileText, Filter, Users } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/firebase/provider";
import { getDoctorProfile, trackActivity } from "@/lib/auth";

export default function PatientsPage() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      getDoctorProfile(user.uid).then(profile => {
        if (profile) {
          // Load patients from localStorage or use empty array
          const STORAGE_KEY = 'mediconnect_patients';
          const storagePatients = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          const userPatients = storagePatients.filter((p: any) => p.doctorId === user.uid);
          setPatients(userPatients.length > 0 ? userPatients : []);
        }
      }).catch(error => {
        console.error("Error loading profile:", error);
        // Try loading from localStorage
        const STORAGE_KEY = 'mediconnect_patients';
        const storagePatients = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const userPatients = storagePatients.filter((p: any) => p.doctorId === user?.uid);
        setPatients(userPatients);
      });
    }
  }, [user]);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewPatient = async () => {
    if (user) {
      await trackActivity(user.uid, 'add-patient', `New patient record added`, 'Started adding a new patient record');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-headline font-bold text-primary">Patient Records</h2>
            <p className="text-sm md:text-base text-muted-foreground">Manage and access centralized patient data.</p>
          </div>
          <Button className="bg-primary w-full md:w-auto" onClick={handleAddNewPatient}>
            <Plus className="mr-2 h-4 w-4" /> Add New Patient
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="pb-3 border-b px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or medical ID..." 
                  className="pl-10 h-10" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <span className="text-xs text-muted-foreground">{filteredPatients.length} records</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {filteredPatients.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <Users className="h-8 w-8 text-primary/40" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">No patients yet</p>
                  <p className="text-xs text-muted-foreground/70">Add your first patient record to get started</p>
                </div>
                <Button className="mt-4" onClick={handleAddNewPatient}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Patient
                </Button>
              </div>
            ) : (
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Medical ID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Age / Gender</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-mono text-[10px] md:text-xs font-bold text-primary">{patient.id}</TableCell>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell className="text-xs">{patient.age}y / {patient.gender}</TableCell>
                        <TableCell className="text-xs">{patient.lastVisit}</TableCell>
                        <TableCell>
                          <Badge variant={patient.status === "Critical" ? "destructive" : "secondary"} className="text-[10px] px-1.5 py-0">
                            {patient.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="flex items-center gap-2 text-xs">
                                <FileText className="h-3.5 w-3.5" /> View Letters
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs">Edit Profile</DropdownMenuItem>
                              <DropdownMenuItem className="text-primary font-medium text-xs">New Consultation</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}