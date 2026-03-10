"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { draftLetter } from "@/ai/flows/ai-draft-letter-flow";
import { useToast } from "@/hooks/use-toast";

const TEMPLATES = [
  { id: "referral", name: "Standard Referral", content: "To [Specialist Name],\n\nI am referring my patient [Patient Name] for evaluation of [Diagnosis].\n\nClinical History:\n[History]\n\nKind regards,\nDr. [Your Name]" },
  { id: "followup", name: "Follow-up Report", content: "Dear Colleague,\n\nI reviewed [Patient Name] today for a follow-up regarding [Diagnosis].\n\nCurrent Status:\n...\n\nPlan:\n..." },
];

export function AILetterAssistant({ onDraftGenerated }: { onDraftGenerated: (draft: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    patientName: "Alice Thompson",
    patientAge: "34",
    patientGender: "Female",
    patientDiagnosis: "Post-operative knee recovery",
    patientHistory: "Patient underwent arthroscopic surgery 2 weeks ago. Complaining of mild swelling.",
    templateId: "referral"
  });

  const handleDraft = async () => {
    setLoading(true);
    try {
      const template = TEMPLATES.find(t => t.id === formData.templateId)?.content || "";
      const output = await draftLetter({
        patientDetails: {
          patientName: formData.patientName,
          patientAge: parseInt(formData.patientAge),
          patientGender: formData.patientGender,
          patientDiagnosis: formData.patientDiagnosis,
          patientHistory: formData.patientHistory,
        },
        templateContent: template
      });
      setResult(output.draftedLetter);
      onDraftGenerated(output.draftedLetter);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate draft. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="shadow-lg border-primary/20 bg-primary/5 border-none ring-1 ring-primary/20">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-primary font-headline text-lg md:text-xl">
          <Sparkles className="h-5 w-5" />
          AI Letter Assistant
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">Generate a clinical draft based on patient details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 md:p-6 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Patient Name</Label>
            <Input 
              value={formData.patientName} 
              onChange={e => setFormData({...formData, patientName: e.target.value})} 
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Diagnosis</Label>
            <Input 
              value={formData.patientDiagnosis} 
              onChange={e => setFormData({...formData, patientDiagnosis: e.target.value})} 
              className="h-9 text-xs"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-bold">Relevant History / Notes</Label>
          <Textarea 
            value={formData.patientHistory} 
            onChange={e => setFormData({...formData, patientHistory: e.target.value})}
            className="h-20 md:h-24 text-xs resize-none"
          />
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary/90 h-10 md:h-12 text-sm font-bold shadow-md" 
          onClick={handleDraft} 
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Generate Draft
        </Button>

        {result && (
          <div className="mt-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center justify-between">
              <Label className="font-bold text-xs text-primary uppercase tracking-widest">Generated Draft</Label>
              <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-7 w-7">
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
            <div className="p-3 md:p-4 bg-white rounded-md border text-[11px] md:text-sm whitespace-pre-wrap font-body max-h-40 md:max-h-60 overflow-y-auto shadow-inner leading-relaxed">
              {result}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}