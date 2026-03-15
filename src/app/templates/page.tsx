"use client";

import React, { useState } from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Edit, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const TEMPLATES = [
  { id: 1, name: "General Referral", category: "Referral", lastUsed: "2 days ago" },
  { id: 2, name: "Cardiology Follow-up", category: "Specialist", lastUsed: "5 days ago" },
  { id: 3, name: "Post-Operative Instructions", category: "Patient Education", lastUsed: "1 week ago" },
  { id: 4, name: "Discharge Summary", category: "Hospital", lastUsed: "3 days ago" },
];

export default function TemplatesPage() {
  const [query, setQuery] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleUseTemplate = (name: string) => {
    toast({
      title: "Template Selected",
      description: `Opening editor with '${name}' template.`
    });
    router.push("/letters/new");
  };

  const filtered = TEMPLATES.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MediMenuBar />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-headline font-bold text-primary">Template Library</h2>
            <p className="text-muted-foreground">Manage and use your standardized clinical letter templates.</p>
          </div>
          <Button className="bg-primary">
            <Plus className="mr-2 h-4 w-4" /> Create Template
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search templates..." 
            className="pl-10" 
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow group border-none ring-1 ring-border">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <CardTitle className="text-lg font-headline mt-4">{template.name}</CardTitle>
                <CardDescription>{template.category}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="text-xs text-muted-foreground">Last used: {template.lastUsed}</div>
                <div className="flex gap-2">
                  <Button className="w-full bg-primary" onClick={() => handleUseTemplate(template.name)}>
                    <Copy className="mr-2 h-4 w-4" /> Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
