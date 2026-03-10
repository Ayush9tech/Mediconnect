
"use client";

import React, { useState } from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Phone, Mail, Award, Loader2, CheckCircle2, Plus, Upload, Pencil, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const INITIAL_DOCTORS = [
  { id: 1, name: "Dr. Sarah Smith", specialty: "Cardiology", location: "Central Hospital", email: "s.smith@hospital.com", initials: "SS", imageUrl: "https://picsum.photos/seed/doc1/200/200", isActive: true },
  { id: 2, name: "Dr. Michael Chen", specialty: "Neurology", location: "Westside Clinic", email: "m.chen@clinic.com", initials: "MC", imageUrl: "https://picsum.photos/seed/doc2/200/200", isActive: false },
  { id: 3, name: "Dr. Eleanor Vance", specialty: "Pediatrics", location: "Children's Health", email: "e.vance@health.com", initials: "EV", imageUrl: "https://picsum.photos/seed/doc3/200/200", isActive: true },
  { id: 4, name: "Dr. Robert Miller", specialty: "Orthopedics", location: "Sports Med Center", email: "r.miller@sports.com", initials: "RM", imageUrl: "https://picsum.photos/seed/doc4/200/200", isActive: true },
];

export default function DirectoryPage() {
  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [isSharing, setIsSharing] = useState<number | null>(null);
  const { toast } = useToast();

  // New Doctor Form State
  const [newDoc, setNewDoc] = useState({
    name: "",
    specialty: "",
    location: "",
    email: "",
    imageUrl: "",
    isActive: true,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Edit Doctor Form State
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'add' | 'edit') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'add') {
          setNewDoc((prev) => ({ ...prev, imageUrl: reader.result as string }));
        } else {
          setEditingDoc((prev: any) => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShareRecord = (doctorId: number, doctorName: string) => {
    setIsSharing(doctorId);
    
    // Simulate clinical record encryption and sharing
    setTimeout(() => {
      setIsSharing(null);
      toast({
        title: "Record Shared Successfully",
        description: `Patient records have been securely transmitted to ${doctorName} and logged in the audit trail.`,
      });
    }, 1500);
  };

  const handleViewProfile = (doctorName: string) => {
    toast({
      title: "Opening Specialist Profile",
      description: `Retrieving verified clinical credentials for ${doctorName}.`,
    });
  };

  const handleEditClick = (doc: any) => {
    setEditingDoc({ ...doc });
    setIsEditDialogOpen(true);
  };

  const handleUpdateDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc.name || !editingDoc.specialty) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please provide at least a name and specialty.",
      });
      return;
    }

    setDoctors(doctors.map(d => d.id === editingDoc.id ? { ...editingDoc } : d));
    setIsEditDialogOpen(false);
    setEditingDoc(null);

    toast({
      title: "Profile Updated",
      description: `${editingDoc.name}'s verified credentials have been updated.`,
    });
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name || !newDoc.specialty) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please provide at least a name and specialty.",
      });
      return;
    }

    const initials = newDoc.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const addedDoc = {
      id: doctors.length + 1,
      ...newDoc,
      initials,
    };

    setDoctors([...doctors, addedDoc]);
    setNewDoc({ name: "", specialty: "", location: "", email: "", imageUrl: "", isActive: true });
    setIsAddDialogOpen(false);

    toast({
      title: "Doctor Added",
      description: `${newDoc.name} has been added to your verified network.`,
    });
  };

  const filtered = doctors.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) || 
    d.specialty.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-primary">Doctor Directory</h2>
            <p className="text-muted-foreground">Find specialists and clinical partners within the verified network.</p>
          </div>
          <div className="flex items-center border border-border rounded-full p-1 bg-white shadow-sm gap-1 h-fit">
            <div className="flex items-center justify-center h-8 w-8 text-green-600 bg-green-50 rounded-full border border-green-100">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-8 w-8 hover:w-32 rounded-full text-destructive hover:bg-destructive/10 transition-all duration-300 overflow-hidden flex items-center justify-start px-1.5 group"
                >
                  <Plus className="h-5 w-5 stroke-[3] shrink-0" />
                  <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 text-[10px] font-black uppercase tracking-widest ml-0 group-hover:ml-2 whitespace-nowrap">
                    Add Doctor
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Specialist</DialogTitle>
                  <DialogDescription>
                    Enter the details of the medical professional you want to add to your clinical network.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddDoctorSubmit} className="space-y-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-xs font-bold uppercase tracking-wider">Name</Label>
                    <Input id="name" value={newDoc.name} onChange={(e) => setNewDoc({...newDoc, name: e.target.value})} className="col-span-3 h-9 text-xs" placeholder="e.g. Dr. John Doe" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="specialty" className="text-right text-xs font-bold uppercase tracking-wider">Specialty</Label>
                    <Input id="specialty" value={newDoc.specialty} onChange={(e) => setNewDoc({...newDoc, specialty: e.target.value})} className="col-span-3 h-9 text-xs" placeholder="e.g. Cardiology" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right text-xs font-bold uppercase tracking-wider">Location</Label>
                    <Input id="location" value={newDoc.location} onChange={(e) => setNewDoc({...newDoc, location: e.target.value})} className="col-span-3 h-9 text-xs" placeholder="e.g. City Hospital" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right text-xs font-bold uppercase tracking-wider">Email</Label>
                    <Input id="email" type="email" value={newDoc.email} onChange={(e) => setNewDoc({...newDoc, email: e.target.value})} className="col-span-3 h-9 text-xs" placeholder="e.g. j.doe@hospital.com" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="isActive" className="text-right text-xs font-bold uppercase tracking-wider">Active</Label>
                    <div className="col-span-3 flex items-center h-9">
                      <Switch id="isActive" checked={newDoc.isActive} onCheckedChange={(checked) => setNewDoc({...newDoc, isActive: checked})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="imageFile" className="text-right text-xs font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                      <Upload className="h-3 w-3" /> Photo
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input 
                        id="imageFile" 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageFileChange(e, 'add')} 
                        className="h-9 text-[10px] py-1 cursor-pointer" 
                      />
                      {newDoc.imageUrl && (
                        <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                          <img src={newDoc.imageUrl} alt="Preview" className="object-cover h-full w-full" />
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-primary w-full sm:w-auto font-bold uppercase tracking-widest text-[10px]">Register Specialist</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by name, specialty or clinic..." 
            className="pl-10 h-12 text-lg shadow-sm border-primary/20 focus-visible:ring-primary" 
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-all border-none ring-1 ring-border group overflow-hidden bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="bg-primary/5 p-6 flex flex-col items-center text-center border-b group-hover:bg-primary/10 transition-colors relative">
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 rounded-full hover:bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleEditClick(doc)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <div className={cn(
                      "transition-all duration-300",
                      doc.isActive ? "text-green-600" : "text-destructive animate-pulse"
                    )}>
                      {doc.isActive ? (
                        <CheckCircle2 className="h-3.5 w-3.5 fill-green-50" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 fill-destructive/10 stroke-[3]" />
                      )}
                    </div>
                  </div>
                  <Avatar className="h-24 w-24 border-4 border-white shadow-xl mb-4 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                    {doc.imageUrl && <AvatarImage src={doc.imageUrl} alt={doc.name} className="object-cover" />}
                    <AvatarFallback className="bg-primary text-white text-2xl font-bold">{doc.initials}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold font-headline group-hover:text-primary transition-colors">{doc.name}</h3>
                  <p className="text-primary font-medium text-sm flex items-center gap-1 mt-1">
                    <Award className="h-4 w-4" /> {doc.specialty}
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary/60" /> {doc.location}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary/60" /> {doc.email}
                    </p>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 shadow-sm font-bold text-xs" 
                      size="sm"
                      onClick={() => handleShareRecord(doc.id, doc.name)}
                      disabled={isSharing === doc.id}
                    >
                      {isSharing === doc.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Encrypting...
                        </>
                      ) : (
                        "Share Record"
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-primary/20 text-primary hover:bg-primary/5 font-bold text-xs"
                      onClick={() => handleViewProfile(doc.name)}
                    >
                      Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <Search className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
              <p className="text-muted-foreground font-medium">No medical professionals found matching your search.</p>
              <Button variant="ghost" onClick={() => setQuery("")}>Clear Search Filters</Button>
            </div>
          )}
        </div>

        {/* Edit Specialist Dialog */}
        {editingDoc && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Specialist Profile</DialogTitle>
                <DialogDescription>
                  Modify the clinical details for {editingDoc.name}.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateDoctorSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right text-xs font-bold uppercase tracking-wider">Name</Label>
                  <Input id="edit-name" value={editingDoc.name} onChange={(e) => setEditingDoc({...editingDoc, name: e.target.value})} className="col-span-3 h-9 text-xs" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-specialty" className="text-right text-xs font-bold uppercase tracking-wider">Specialty</Label>
                  <Input id="edit-specialty" value={editingDoc.specialty} onChange={(e) => setEditingDoc({...editingDoc, specialty: e.target.value})} className="col-span-3 h-9 text-xs" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-location" className="text-right text-xs font-bold uppercase tracking-wider">Location</Label>
                  <Input id="edit-location" value={editingDoc.location} onChange={(e) => setEditingDoc({...editingDoc, location: e.target.value})} className="col-span-3 h-9 text-xs" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right text-xs font-bold uppercase tracking-wider">Email</Label>
                  <Input id="edit-email" type="email" value={editingDoc.email} onChange={(e) => setEditingDoc({...editingDoc, email: e.target.value})} className="col-span-3 h-9 text-xs" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-isActive" className="text-right text-xs font-bold uppercase tracking-wider">Active</Label>
                  <div className="col-span-3 flex items-center h-9">
                    <Switch id="edit-isActive" checked={editingDoc.isActive} onCheckedChange={(checked) => setEditingDoc({...editingDoc, isActive: checked})} />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-imageFile" className="text-right text-xs font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                    <Upload className="h-3 w-3" /> Photo
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <Input 
                      id="edit-imageFile" 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageFileChange(e, 'edit')} 
                      className="h-9 text-[10px] py-1 cursor-pointer" 
                    />
                    {editingDoc.imageUrl && (
                      <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                        <img src={editingDoc.imageUrl} alt="Preview" className="object-cover h-full w-full" />
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-primary w-full sm:w-auto font-bold uppercase tracking-widest text-[10px]">Update Specialist</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}
