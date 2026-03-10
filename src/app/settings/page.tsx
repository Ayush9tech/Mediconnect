
"use client";

import React, { useState, useEffect } from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User, Settings, ShieldCheck, Bell, Smartphone, Monitor, Loader2, Save, Award, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        try {
          const docRef = doc(firestore, "store_users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchProfile();
  }, [user, firestore]);

  const handleSave = () => {
    if (!user || !profile) return;
    
    setIsSaving(true);
    const docRef = doc(firestore, "store_users", user.uid);
    
    updateDocumentNonBlocking(docRef, profile);
    
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Clinical Profile Updated",
        description: "Your professional data has been securely saved to the Hub.",
      });
    }, 800);
  };

  const updateField = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <MediMenuBar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar />
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">Settings & Professional Identity</h2>
          <p className="text-muted-foreground">Manage your clinical credentials, contact details, and platform preferences.</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px] mb-8">
            <TabsTrigger value="account">Clinical Profile</TabsTrigger>
            <TabsTrigger value="preferences">App Config</TabsTrigger>
            <TabsTrigger value="security">Access Security</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4 pt-0">
            <Card className="border-none ring-1 ring-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Professional Credentials
                </CardTitle>
                <CardDescription>Update your medical qualifications and clinical area of expertise.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                    <Input id="firstName" value={profile?.firstName || ""} onChange={(e) => updateField("firstName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                    <Input id="lastName" value={profile?.lastName || ""} onChange={(e) => updateField("lastName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Medical Email</Label>
                    <Input id="email" value={profile?.email || ""} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Award className="h-3 w-3" /> Primary Specialty</Label>
                    <Input id="specialty" value={profile?.specialization || ""} onChange={(e) => updateField("specialization", e.target.value)} placeholder="e.g. General Physician" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualification" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Award className="h-3 w-3" /> Qualification</Label>
                    <Input id="qualification" value={profile?.qualification || ""} onChange={(e) => updateField("qualification", e.target.value)} placeholder="e.g. MBBS, MD" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> Contact Phone</Label>
                    <Input id="phone" value={profile?.phone || ""} onChange={(e) => updateField("phone", e.target.value)} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Clinical Address</Label>
                  <Input id="address" value={profile?.address || ""} onChange={(e) => updateField("address", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Professional Bio</Label>
                  <Input id="bio" value={profile?.bio || ""} onChange={(e) => updateField("bio", e.target.value)} placeholder="Brief clinical background..." />
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving} className="bg-primary px-8">
                    {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Identity Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4 pt-0">
            <Card className="border-none ring-1 ring-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" /> Application Workflow
                </CardTitle>
                <CardDescription>Configure notifications and display modes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-semibold">
                      <Bell className="h-4 w-4" /> Email Alerts
                    </div>
                    <p className="text-sm text-muted-foreground">Get notified when colleagues share clinical records.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-semibold">
                      <Smartphone className="h-4 w-4" /> Mobile Sync
                    </div>
                    <p className="text-sm text-muted-foreground">Enable clinical push notifications.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSave} className="bg-primary">Update Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 pt-0">
            <Card className="border-none ring-1 ring-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" /> HIPAA Access Security
                </CardTitle>
                <CardDescription>Manage credentials and multi-factor authentication.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-pass" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Password</Label>
                  <Input id="current-pass" type="password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-pass" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Password</Label>
                    <Input id="new-pass" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-pass" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirm Password</Label>
                    <Input id="confirm-pass" type="password" />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button variant="destructive">Update Security Access</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
