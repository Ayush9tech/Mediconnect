
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope, ShieldCheck, Share2, UserPlus, LogIn, Loader2, HeartPulse, ChevronRight, AlertCircle, Award, Phone, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, useUser, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { doc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function EntryPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { auth, firestore } = useFirebaseSafely();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  // Form State
  const [email, setEmail] = useState("julian.vane@mediconnect.com");
  const [password, setPassword] = useState("password123");
  
  // Profile Expansion State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

  const handleAuth = async () => {
    if (!auth || !firestore) {
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Clinical services are currently initializing. Please wait.",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Access Granted",
          description: "Welcome back to your clinical dashboard.",
        });
      } else {
        if (!firstName || !lastName || !specialization) {
          throw new Error("Please complete essential clinical profile fields.");
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        // Provision Detailed Clinical Profile in Firestore
        const userRef = doc(firestore, "store_users", newUser.uid);
        setDocumentNonBlocking(userRef, {
          id: newUser.uid,
          username: email.split('@')[0],
          email: newUser.email,
          firstName: firstName,
          lastName: lastName,
          specialization: specialization,
          qualification: qualification,
          phone: phone,
          address: address,
          role: "doctor",
          storeId: "default-clinic",
          lastLogin: serverTimestamp(),
        }, { merge: true });

        toast({
          title: "Registration Complete",
          description: "Your detailed professional profile has been securely provisioned.",
        });
      }
    } catch (error: any) {
      setIsLoading(false);
      let message = "Authentication failed. Please verify your credentials.";
      
      if (error.code === 'auth/email-already-in-use') message = "This medical email is already registered.";
      if (error.code === 'auth/weak-password') message = "Password must be at least 6 characters.";
      if (error.code === 'auth/invalid-credential') message = "Invalid email or password.";
      if (error.message) message = error.message;

      toast({
        variant: "destructive",
        title: "Clinical Error",
        description: message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F0F4] relative flex items-center justify-center p-4 overflow-hidden font-body">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full animate-pulse blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full animate-bounce blur-3xl duration-[15s]" />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-10 hidden lg:block">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary rounded-3xl text-white shadow-2xl shadow-primary/30 animate-in zoom-in duration-1000">
              <Stethoscope className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-5xl font-headline font-bold text-primary tracking-tight">MediConnect</h1>
              <p className="text-sm font-bold text-accent uppercase tracking-[0.3em]">Clinical Hub</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-6xl font-headline font-bold leading-[1.1] text-foreground">
              Advancing connectivity for <span className="text-primary">Clinical Excellence.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Securely manage your professional identity and clinical network in a unified environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Feature icon={<ShieldCheck className="h-6 w-6 text-primary" />} title="HIPAA Compliant" desc="Military-grade encryption for all patient records." />
            <Feature icon={<Share2 className="h-6 w-6 text-primary" />} title="Instant Sharing" desc="Seamless record exchange across clinical networks." />
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-lg shadow-[0_20px_80px_rgba(0,0,0,0.12)] border-none bg-white/90 backdrop-blur-2xl ring-1 ring-white/50 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
            <CardHeader className="space-y-2 pb-6 text-center">
              <CardTitle className="text-4xl font-headline font-bold tracking-tight">
                {isLogin ? "Welcome Back" : "Join the Network"}
              </CardTitle>
              <CardDescription className="text-base font-medium">
                {isLogin 
                  ? "Access your professional dashboard." 
                  : "Complete your professional medical profile."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-8 max-h-[60vh] overflow-y-auto">
              {!isLogin && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">First Name</Label>
                      <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="bg-muted/30 border-none h-10 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Last Name</Label>
                      <Input value={lastName} onChange={e => setLastName(e.target.value)} className="bg-muted/30 border-none h-10 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Specialization</Label>
                      <Input placeholder="e.g. Cardiology" value={specialization} onChange={e => setSpecialization(e.target.value)} className="bg-muted/30 border-none h-10 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Qualification</Label>
                      <Input placeholder="e.g. MBBS, MD" value={qualification} onChange={e => setQualification(e.target.value)} className="bg-muted/30 border-none h-10 text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Professional Phone</Label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-muted/30 border-none h-10 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Clinical Address</Label>
                    <Input value={address} onChange={e => setAddress(e.target.value)} className="bg-muted/30 border-none h-10 text-sm" />
                  </div>
                </div>
              )}
              
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Email Address</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-muted/30 border-none h-10 text-sm" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Password</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-muted/30 border-none h-10 text-sm" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 pt-6 pb-10 px-8">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-base font-bold py-6 h-auto shadow-xl rounded-2xl transition-all active:scale-[0.98]"
                onClick={handleAuth}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : isLogin ? "Access Dashboard" : "Register Profile"}
              </Button>
              
              <div className="flex flex-col items-center gap-4 w-full">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:text-accent transition-colors"
                >
                  {isLogin ? "Join the Network" : "Return to Sign In"}
                </button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-3xl hover:bg-white transition-all duration-300 group cursor-default shadow-sm border border-transparent hover:border-border">
      <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-foreground tracking-tight">{title}</h3>
        <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
      </div>
    </div>
  );
}

function useFirebaseSafely() {
  const auth = useAuth();
  const firestore = useFirestore();
  return { auth, firestore };
}
