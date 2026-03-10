
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Settings, ShieldCheck, Bell, Smartphone, Monitor, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase/provider";
import { getDoctorProfile, saveDoctorProfile, DoctorProfile } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const { toast } = useToast();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<DoctorProfile>>({});

  // Load profile data on component mount
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const profileData = await getDoctorProfile(user.uid);
      if (profileData) {
        setProfile(profileData);
      } else {
        // Initialize with basic info
        setProfile({
          name: user.displayName || '',
          email: user.email || '',
          notifications: {
            email: true,
            sms: false,
            push: true,
          },
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await saveDoctorProfile(user.uid, profile);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof DoctorProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (type: 'email' | 'sms' | 'push', value: boolean) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <MediMenuBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your settings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar />
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">Settings & Preferences</h2>
          <p className="text-muted-foreground">Manage your clinical account, notifications, and security settings.</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4 pt-4">
            <Card className="border-none ring-1 ring-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Profile Information
                </CardTitle>
                <CardDescription>Update your medical professional profile details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={profile.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Dr. John Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Medical Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="doctor@clinic.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={profile.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Professional Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Primary Specialty *</Label>
                      <Input
                        id="specialization"
                        value={profile.specialization || ''}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        placeholder="e.g., Cardiology, Pediatrics"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Medical License Number</Label>
                      <Input
                        id="licenseNumber"
                        value={profile.licenseNumber || ''}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        placeholder="MED-12345-AB"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                      <Input
                        id="yearsOfExperience"
                        type="number"
                        value={profile.yearsOfExperience || ''}
                        onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || undefined)}
                        placeholder="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        type="number"
                        value={profile.graduationYear || ''}
                        onChange={(e) => handleInputChange('graduationYear', parseInt(e.target.value) || undefined)}
                        placeholder="2010"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicalSchool">Medical School</Label>
                    <Input
                      id="medicalSchool"
                      value={profile.medicalSchool || ''}
                      onChange={(e) => handleInputChange('medicalSchool', e.target.value)}
                      placeholder="Harvard Medical School"
                    />
                  </div>
                </div>

                <Separator />

                {/* Practice Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Practice Information</h4>
                  <div className="space-y-2">
                    <Label htmlFor="clinicName">Clinic/Hospital Name</Label>
                    <Input
                      id="clinicName"
                      value={profile.clinicName || ''}
                      onChange={(e) => handleInputChange('clinicName', e.target.value)}
                      placeholder="City General Hospital"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinicAddress">Clinic Address</Label>
                    <Textarea
                      id="clinicAddress"
                      value={profile.clinicAddress || ''}
                      onChange={(e) => handleInputChange('clinicAddress', e.target.value)}
                      placeholder="123 Medical Center Dr, City, State 12345"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clinicPhone">Clinic Phone</Label>
                      <Input
                        id="clinicPhone"
                        type="tel"
                        value={profile.clinicPhone || ''}
                        onChange={(e) => handleInputChange('clinicPhone', e.target.value)}
                        placeholder="+1 (555) 987-6543"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinicEmail">Clinic Email</Label>
                      <Input
                        id="clinicEmail"
                        type="email"
                        value={profile.clinicEmail || ''}
                        onChange={(e) => handleInputChange('clinicEmail', e.target.value)}
                        placeholder="info@clinic.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4 pt-4">
            <Card className="border-none ring-1 ring-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" /> App Preferences
                </CardTitle>
                <CardDescription>Configure how you interact with MediConnect Hub.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Notifications</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-semibold">
                        <Bell className="h-4 w-4" /> Email Notifications
                      </div>
                      <p className="text-sm text-muted-foreground">Receive alerts when letters are shared with you.</p>
                    </div>
                    <Switch
                      checked={profile.notifications?.email ?? true}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-semibold">
                        <Smartphone className="h-4 w-4" /> Push Notifications
                      </div>
                      <p className="text-sm text-muted-foreground">Mobile alerts for urgent clinical updates.</p>
                    </div>
                    <Switch
                      checked={profile.notifications?.push ?? true}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-semibold">
                        <Bell className="h-4 w-4" /> SMS Notifications
                      </div>
                      <p className="text-sm text-muted-foreground">Text message alerts for critical updates.</p>
                    </div>
                    <Switch
                      checked={profile.notifications?.sms ?? false}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Appearance</h4>
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme Preference</Label>
                    <Select value={profile.theme || 'system'} onValueChange={(value) => handleInputChange('theme', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Localization</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={profile.language || 'en'} onValueChange={(value) => handleInputChange('language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={profile.timezone || 'UTC'} onValueChange={(value) => handleInputChange('timezone', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="Europe/London">London</SelectItem>
                          <SelectItem value="Europe/Paris">Paris</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 pt-4">
            <Card className="border-none ring-1 ring-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Security Settings
                </CardTitle>
                <CardDescription>Manage password and clinical authentication factors.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <p className="font-semibold text-green-700">Account Security Status</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your account is secured with Firebase Authentication. Password changes must be done through your authentication provider.
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Created</Label>
                      <p className="text-sm text-muted-foreground p-2 bg-muted/50 rounded">
                        {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Not available'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Last Updated</Label>
                      <p className="text-sm text-muted-foreground p-2 bg-muted/50 rounded">
                        {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'Not available'}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="space-y-0.5">
                    <p className="font-bold">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your clinical account.</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="space-y-0.5">
                    <p className="font-bold">Session Management</p>
                    <p className="text-sm text-muted-foreground">View and manage your active sessions.</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground text-red-600">Danger Zone</h4>
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-bold text-red-700">Delete Account</p>
                        <p className="text-sm text-red-600">Permanently delete your account and all associated data.</p>
                      </div>
                      <Button variant="destructive" size="sm" disabled>
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
