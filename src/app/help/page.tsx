
"use client";

import React from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LifeBuoy, Search, Video, FileText, MessageSquare, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const [search, setSearch] = React.useState("");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar />
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl font-headline font-bold text-primary">How can we help you today?</h2>
          <p className="text-muted-foreground">Search our documentation, watch tutorials, or contact clinical support.</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search guides, tutorials, and FAQs..." 
              className="pl-10 h-12 text-lg shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HelpCategory 
            icon={<FileText className="h-6 w-6" />} 
            title="Getting Started" 
            description="Learn the basics of drafting and sharing letters."
          />
          <HelpCategory 
            icon={<Video className="h-6 w-6" />} 
            title="Video Tutorials" 
            description="Visual walkthroughs of advanced features."
          />
          <HelpCategory 
            icon={<ShieldCheck className="h-6 w-6" />} 
            title="Security & HIPAA" 
            description="Understanding our clinical compliance standards."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none ring-1 ring-border shadow-sm">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions from medical professionals using the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I share a letter securely with a specialist?</AccordionTrigger>
                    <AccordionContent>
                      Navigate to the 'Directory' or use the 'Share' menu within the editor. You can select a verified doctor from the network and click 'Share Record'. All data is encrypted end-to-end.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Can I import existing clinical templates?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can go to the 'Templates Manager' under the 'Tools' menu to import standardized .docx or .pdf templates to use in your drafting.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is the AI Assistant HIPAA compliant?</AccordionTrigger>
                    <AccordionContent>
                      Our AI engine operates within a secure VPC environment. No patient data is stored or used for training models outside of your clinical instance, maintaining full compliance.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How do I recover a deleted draft?</AccordionTrigger>
                    <AccordionContent>
                      Deleted drafts are stored in the 'Audit Log' for 30 days. You can access the log via the 'View' menu and request a restoration from a system administrator.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none ring-1 ring-border shadow-sm bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" /> Latest Tutorial
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative group cursor-pointer overflow-hidden border">
                    <img 
                      src="https://picsum.photos/seed/help1/400/225" 
                      alt="Tutorial Thumbnail" 
                      className="object-cover w-full h-full opacity-60 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Video className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">Mastering the AI Assistant</p>
                  <p className="text-xs text-muted-foreground">Learn how to generate professional referrals in seconds.</p>
                </CardContent>
              </Card>

              <Card className="border-none ring-1 ring-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LifeBuoy className="h-5 w-5 text-accent" /> Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DocLink title="System Architecture Overview" />
                  <DocLink title="Advanced Sharing Permissions" />
                  <DocLink title="API Integration for Hospitals" />
                  <DocLink title="Audit Compliance Guide" />
                  <Button variant="outline" className="w-full mt-2" asChild>
                    <Link href="/help">View All Docs <ExternalLink className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-accent text-accent-foreground border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" /> Live Support
                </CardTitle>
                <CardDescription className="text-accent-foreground/80">Need immediate assistance? Our clinical support team is here for you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70">Support Hours</p>
                  <p className="text-sm">Mon - Fri: 8 AM - 8 PM EST</p>
                  <p className="text-sm">Sat - Sun: 10 AM - 4 PM EST</p>
                </div>
                <Button variant="secondary" className="w-full font-bold">Start Live Chat</Button>
                <p className="text-[10px] text-center opacity-70">Average response time: 2 minutes</p>
              </CardContent>
            </Card>

            <Card className="border-none ring-1 ring-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Clinical Exchange</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold uppercase">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Operational
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">AI Assistant</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold uppercase">
                    <div className="h-2 w-2 rounded-full bg-green-500" /> Operational
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Secure Storage</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold uppercase">
                    <div className="h-2 w-2 rounded-full bg-green-500" /> Operational
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function HelpCategory({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="hover:ring-primary/50 transition-all cursor-pointer group border-none ring-1 ring-border">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
            {icon}
          </div>
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors font-headline">{title}</h3>
          <p className="text-sm text-muted-foreground leading-snug">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DocLink({ title }: { title: string }) {
  return (
    <Link href="/help" className="flex items-center justify-between text-sm p-2 hover:bg-muted rounded-md transition-colors group">
      <span className="group-hover:text-primary font-medium">{title}</span>
      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
