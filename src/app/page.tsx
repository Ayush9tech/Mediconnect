
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, ShieldCheck, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase/provider";
import { signIn, signUp, saveDoctorProfile, getDoctorProfile, testFirestoreConnection } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [doctorName, setDoctorName] = useState("");
  const [showDoctorForm, setShowDoctorForm] = useState(false);

  useEffect(() => {
    // Test Firestore connection on component mount
    testFirestoreConnection();
  }, []);

  useEffect(() => {
    if (!isUserLoading && user) {
      checkDoctorProfile();
    }
  }, [user, isUserLoading]);

  const checkDoctorProfile = async () => {
    if (!user) return;
    console.log("Checking doctor profile for user:", user.uid);
    try {
      const profile = await getDoctorProfile(user.uid);
      console.log("Doctor profile result:", profile);
      if (profile) {
        console.log("Redirecting to dashboard");
        router.push("/dashboard");
      } else {
        console.log("Showing doctor form");
        setShowDoctorForm(true);
      }
    } catch (error) {
      console.error("Error checking doctor profile:", error);
      // If there's an error, assume no profile exists and show the form
      setShowDoctorForm(true);
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !doctorName.trim()) return;

    try {
      await saveDoctorProfile(user.uid, {
        name: doctorName.trim(),
        email: user.email || '',
      });
      toast({
        title: "Profile created",
        description: "Welcome to MediConnect Hub!",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isUserLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user && showDoctorForm) {
    return (
      <div className="min-h-screen bg-[#F1F0F4] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to MediConnect Hub</CardTitle>
            <CardDescription>Please enter your doctor's name to complete setup.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDoctorSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="doctorName">Doctor's Name</Label>
                  <Input
                    id="doctorName"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F1F0F4] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-xl text-white">
              <Stethoscope className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-headline font-bold text-primary">MediConnect Hub</h1>
          </div>
          <h2 className="text-4xl font-headline font-bold leading-tight">Secure connectivity for clinical excellence.</h2>
          <p className="text-lg text-muted-foreground">The authoritative platform for doctor-to-doctor sharing, consultation letter drafting, and collaborative patient care.</p>

          <div className="space-y-4">
            <Feature icon={<ShieldCheck className="h-5 w-5 text-accent" />} text="Military-grade end-to-end encryption" />
            <Feature icon={<Share2 className="h-5 w-5 text-accent" />} text="Seamless intra-system record sharing" />
            <Feature icon={<Stethoscope className="h-5 w-5 text-accent" />} text="AI-powered medical drafting assistant" />
          </div>
        </div>

        <Card className="shadow-2xl border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-headline">Clinical Access</CardTitle>
            <CardDescription>Sign in or create an account to access your clinical dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthTabs />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AuthTabs() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(email, password);
      toast({
        title: "Account created successfully",
        description: "Please complete your profile.",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signin-password">Password</Label>
            <Input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="signup">
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-1 rounded-full bg-accent/10">{icon}</div>
      <span className="font-medium">{text}</span>
    </div>
  );
}
