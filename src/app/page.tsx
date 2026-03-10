
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope, ShieldCheck, Share2, LogIn, Loader2, ChevronRight, Award, HeartPulse, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, useUser, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { doc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function EntryPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const { auth, firestore } = useFirebaseSafely();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Profile Expansion State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    // Initial Splash Timer
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user && !isUserLoading && !isAppLoading) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, isAppLoading, router]);

  const handleAuth = async () => {
    if (!auth || !firestore) {
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Clinical services are currently initializing. Please wait.",
      });
      return;
    }

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter your clinical email and password.",
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
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') message = "Invalid email or password. Please sign up if you don't have an account.";
      if (error.message) message = error.message;

      toast({
        variant: "destructive",
        title: "Clinical Error",
        description: message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4 overflow-hidden font-body text-foreground transition-colors duration-500">
      <AnimatePresence>
        {isAppLoading ? (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut" 
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <div className="p-8 bg-primary rounded-[2.5rem] text-primary-foreground shadow-2xl relative z-10">
                <HeartPulse className="h-16 w-16" />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center space-y-2"
            >
              <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">MediConnect Hub</h1>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm font-medium">
                <Activity className="h-4 w-4 animate-pulse text-accent" />
                <span>Connecting to Clinical Instance...</span>
              </div>
            </motion.div>
            
            <div className="absolute bottom-12 w-full max-w-[200px]">
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="h-full w-1/2 bg-primary rounded-full"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full flex items-center justify-center"
          >
            {/* Dynamic Background Pulse Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/10 rounded-full animate-pulse blur-[140px]" />
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full animate-bounce blur-[110px] duration-[12s]" />
              <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/15 rounded-full animate-pulse blur-[90px] duration-[10s]" />
              
              {/* Animated EKG Line Overlay - High Visibility */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.08] stroke-primary" viewBox="0 0 1000 100" preserveAspectRatio="none">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1, x: [0, -500] }}
                  transition={{ 
                    pathLength: { duration: 2, ease: "easeInOut" },
                    x: { duration: 15, repeat: Infinity, ease: "linear" }
                  }}
                  d="M0,50 L100,50 L110,30 L120,70 L130,50 L200,50 L210,10 L220,90 L230,50 L300,50 L310,40 L320,60 L330,50 L400,50 L410,30 L420,70 L430,50 L500,50 L510,10 L520,90 L530,50 L600,50 L610,40 L620,60 L630,50 L700,50 L710,30 L720,70 L730,50 L800,50 L810,10 L820,90 L830,50 L900,50 L910,40 L920,60 L930,50 L1000,50"
                  fill="none"
                  strokeWidth="3"
                />
              </svg>
            </div>

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 px-4">
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="space-y-10 hidden lg:block"
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary rounded-3xl text-primary-foreground shadow-2xl shadow-primary/20">
                    <Stethoscope className="h-10 w-10" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">MediConnect</h1>
                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Clinical Excellence Hub</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-6xl font-headline font-bold leading-[1.05] text-foreground tracking-tight">
                    Advancing connectivity for <span className="text-primary italic">Clinical Care.</span>
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-lg font-medium">
                    Securely manage your professional identity and clinical network in a unified, modern environment.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <Feature icon={<ShieldCheck className="h-6 w-6 text-primary" />} title="Secure Storage" desc="All patient and clinical records are encrypted end-to-end." />
                  <Feature icon={<Share2 className="h-6 w-6 text-primary" />} title="Clinical Exchange" desc="Instant, secure sharing across your professional network." />
                </div>
              </motion.div>

              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
                className="flex justify-center lg:justify-end"
              >
                {/* LIQUID GLASS CARD */}
                <Card className="w-full max-w-lg shadow-[0_20px_80px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_80px_-10px_rgba(0,0,0,0.6)] border-none bg-white/10 dark:bg-black/20 backdrop-blur-md ring-1 ring-white/30 dark:ring-white/10 overflow-hidden rounded-[2.5rem]">
                  <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
                  <CardHeader className="space-y-2 pb-6 text-center pt-10">
                    <CardTitle className="text-4xl font-headline font-bold tracking-tight">
                      {isLogin ? "Welcome Back" : "Clinical Registration"}
                    </CardTitle>
                    <CardDescription className="text-base font-medium">
                      {isLogin 
                        ? "Access your unified clinical dashboard." 
                        : "Provision your professional clinical profile."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-10 max-h-[60vh] overflow-y-auto thin-scrollbar">
                    {!isLogin && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/90">First Name</Label>
                            <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="bg-white/40 dark:bg-black/40 border-none h-11 text-sm focus-visible:ring-primary/40 backdrop-blur-sm" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/90">Last Name</Label>
                            <Input value={lastName} onChange={e => setLastName(e.target.value)} className="bg-white/40 dark:bg-black/40 border-none h-11 text-sm focus-visible:ring-primary/40 backdrop-blur-sm" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/90">Specialization</Label>
                            <Input placeholder="e.g. Cardiology" value={specialization} onChange={e => setSpecialization(e.target.value)} className="bg-white/40 dark:bg-black/40 border-none h-11 text-sm focus-visible:ring-primary/40 backdrop-blur-sm" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/90">Qualification</Label>
                            <Input placeholder="e.g. MBBS, MD" value={qualification} onChange={e => setQualification(e.target.value)} className="bg-white/40 dark:bg-black/40 border-none h-11 text-sm focus-visible:ring-primary/40 backdrop-blur-sm" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/90">Professional Phone</Label>
                          <Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-white/40 dark:bg-black/40 border-none h-11 text-sm focus-visible:ring-primary/40 backdrop-blur-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/90">Clinical Address</Label>
                          <Input value={address} onChange={e => setAddress(e.target.value)} className="bg-white/40 dark:bg-black/40 border-none h-11 text-sm focus-visible:ring-primary/40 backdrop-blur-sm" />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/90">Email Address</Label>
                      <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/40 dark:bg-black/40 border-none h-11 text-sm focus-visible:ring-primary/40 backdrop-blur-sm" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/90">Password</Label>
                      <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-white/40 dark:bg-black/40 border-none h-11 text-sm focus-visible:ring-primary/40 backdrop-blur-sm" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-6 pt-10 pb-12 px-10">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-base font-bold py-7 h-auto shadow-xl rounded-2xl transition-all active:scale-[0.98]"
                      onClick={handleAuth}
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : isLogin ? "Access Clinical Dashboard" : "Register Medical Profile"}
                    </Button>
                    
                    <div className="flex flex-col items-center gap-4 w-full">
                      <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary font-black uppercase tracking-[0.25em] text-[10px] hover:text-accent transition-all group flex items-center gap-2"
                      >
                        <span>{isLogin ? "Join the Network" : "Return to Clinical Sign In"}</span>
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-5 p-5 rounded-3xl hover:bg-card/30 transition-all duration-300 group cursor-default border border-transparent hover:border-white/10">
      <div className="p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
        {icon}
      </div>
      <div className="space-y-1.5">
        <h3 className="font-bold text-lg text-foreground tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground leading-snug font-medium opacity-80">{desc}</p>
      </div>
    </div>
  );
}

function useFirebaseSafely() {
  const auth = useAuth();
  const firestore = useFirestore();
  return { auth, firestore };
}
