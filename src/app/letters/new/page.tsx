
"use client";

import React, { useState, useEffect, useRef } from "react";
import { MediMenuBar } from "@/components/layout/MediMenuBar";
import { AILetterAssistant } from "@/components/letters/AILetterAssistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Share2, Printer, Trash2, ChevronLeft, Users, FileType, Bold, Italic, Type, Languages } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const COLOR_PRESETS = [
  { name: "Black", value: "#000000" },
  { name: "Dark Gray", value: "#333333" },
  { name: "Medical Blue", value: "#3D29A3" },
  { name: "Cerulean", value: "#2563eb" },
  { name: "Deep Red", value: "#991b1b" },
  { name: "Dark Green", value: "#065f46" },
];

const FONT_SIZES = [
  { name: "Small", value: "1" },
  { name: "Normal", value: "3" },
  { name: "Medium", value: "4" },
  { name: "Large", value: "5" },
  { name: "X-Large", value: "6" },
  { name: "Huge", value: "7" },
];

const HINDI_DISEASES = [
  "डायबिटीज", "थायराइड", "पीसीओडी", "अनियमित पीरियड", "दाग-धब्बे", 
  "कील-मुहाँसे", "गुर्दे की पथरी", "गुप्त रोग", "बालों की समस्या", 
  "जोड़ों का दर्द", "ब्लड प्रेशर", "मानसिक रोग", "चर्म रोग", 
  "पेट सम्बन्धित रोग", "बवासीर"
];

const ENGLISH_DISEASES = [
  "Diabetes", "Thyroid", "PCOD", "Irregular Periods", "Blemishes",
  "Acne/Pimples", "Kidney Stones", "Private Diseases", "Hair Problems",
  "Joint Pain", "Blood Pressure", "Mental Illness", "Skin Diseases",
  "Stomach Problems", "Piles"
];

const DICTIONARY = {
  en: {
    clinicName: "Dr. IQBAL'S",
    homoeoCentre: "Homoeopathic Centre",
    tagline: "Preserve your health naturally with our advanced Homoeopathy treatments.",
    reg: "REG",
    appt: "APPT",
    notValid: "Not Valid for Medico Legal Purpose",
    valid7Days: "Valid for 07 days only",
    date: "Date",
    name: "Name",
    ageSex: "Age/Sex",
    dihNo: "DIH No",
    followUp: "Next Follow up",
    prescription: "PRESCRIPTION",
    treatableTitle: "Complete Treatment For:",
    patientName: "Patient Name",
    specialization: "Specialization",
    subject: "Subject",
    startTyping: "Begin prescription details here...",
  },
  hi: {
    clinicName: "डॉ. इकबाल",
    homoeoCentre: "होम्योपैथिक सेंटर",
    tagline: "उन्नत होम्योपैथी उपचार के साथ प्राकृतिक रूप से अपने स्वास्थ्य को सुरक्षित रखें।",
    reg: "पंजीकरण",
    appt: "अपॉइंटमेंट",
    notValid: "मेडिको लीगल उद्देश्य के लिए मान्य नहीं",
    valid7Days: "केवल 07 दिनों के लिए मान्य",
    date: "दिनांक",
    name: "नाम",
    ageSex: "आयु/लिंग",
    dihNo: "डीआईएच नं.",
    followUp: "अगली मुलाकात",
    prescription: "नुस्खा",
    treatableTitle: "निम्न समस्याओं का सम्पूर्ण इलाज:",
    patientName: "मरीज का नाम",
    specialization: "विशेषज्ञता",
    subject: "विषय",
    startTyping: "प्रिस्क्रिप्शन विवरण यहाँ शुरू करें...",
  }
};

const ensureFirstLine = (el: HTMLDivElement | null) => {
  if (el && el.innerHTML.trim() === "") {
    el.innerHTML = "<div><br></div>";
  }
};

const templateCommonStyles = `
  .rx-content { 
    min-height: 500px; 
    font-size: 14px; 
    line-height: 1.6; 
    outline: none; 
    counter-reset: line; 
    display: block;
    width: 100%;
  }
  .rx-content > div { 
    position: relative; 
    padding-left: 35px; 
    min-height: 1.6em; 
    display: block;
    margin: 0;
  }
  .rx-content > div::before { 
    counter-increment: line; 
    content: counter(line) ". "; 
    position: absolute; 
    left: 0; 
    width: 30px;
    text-align: right;
    color: #999; 
    font-weight: normal; 
    font-style: normal;
    font-size: 0.9em;
  }
  .doc-name { font-size: 16px; font-weight: 800; color: inherit; }
  .doc-qual { font-size: 11px; color: #666; margin-bottom: 4px; }
  .hindi-list { list-style-type: disc; padding-left: 20px; font-size: 13px; line-height: 1.8; margin-top: 10px; }
  .hindi-list li { margin-bottom: 8px; font-weight: 600; }
  .editable-field { border: none; background: transparent; outline: none; width: 100%; padding: 2px; color: inherit; font-size: inherit; }
`;

const IqbalTemplate = ({ content, setContent, textColor, lang }: any) => {
  const [patientName, setPatientName] = useState("Alice Thompson");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [ageSex, setAgeSex] = useState("34 / F");
  const [dihNo, setDihNo] = useState("#88219");
  const editorRef = useRef<HTMLDivElement>(null);
  const lastContent = useRef(content);
  const t = DICTIONARY[lang as keyof typeof DICTIONARY];
  const diseases = lang === 'hi' ? HINDI_DISEASES : ENGLISH_DISEASES;

  useEffect(() => { 
    ensureFirstLine(editorRef.current); 
    if (editorRef.current && content !== lastContent.current) {
      editorRef.current.innerHTML = content || "<div><br></div>";
      lastContent.current = content;
    }
  }, [content]);

  return (
    <div className="bg-white shadow-2xl mx-auto overflow-hidden print:shadow-none print:m-0 w-full max-w-[210mm] min-h-[297mm] flex flex-col" style={{ fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}>
      <style>{`
        ${templateCommonStyles}
        .iqbal-template { --primary-light: #159895; --primary-dark: #0A3641; display: flex; flex-direction: column; flex-grow: 1; }
        .decor-top { height: 35px; display: flex; width: 100%; background: #ffffff; gap: 12px; }
        .skew-top { transform: skewX(-35deg); height: 100%; }
        .bg-dark { background-color: #0A3641; }
        .bg-light { background-color: #159895; }
        .header-content { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px 15px 40px; }
        .h-title { color: #0A3641; font-size: 26px; font-weight: 800; margin: 0; text-transform: uppercase; }
        .h-subtitle { color: #666666; font-size: 13px; letter-spacing: 1px; margin: 5px 0; text-transform: uppercase; }
        .h-desc { font-size: 10px; color: #666666; line-height: 1.3; }
        .patient-table { display: flex; width: 100%; border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; padding: 0 40px; }
        .p-cell { flex: 1; padding: 8px 10px; border-right: 1px solid #cccccc; font-size: 11px; color: #333333; display: flex; align-items: center; }
        .p-cell:last-child { border-right: none; }
        .p-label { color: #666666; margin-right: 5px; font-weight: bold; }
        .main-body { display: flex; flex-grow: 1; padding: 20px 40px; }
        .sidebar { width: 35%; border-right: 2px solid #cccccc; padding-right: 20px; display: flex; flex-direction: column; }
        .rx-logo { font-family: 'Times New Roman', serif; color: #159895; font-size: 38px; font-weight: bold; margin-bottom: 25px; }
        .hindi-section { margin-top: 15px; border-top: 1px dashed #cccccc; padding-top: 15px; }
        .hindi-title { font-size: 15px; font-weight: 900; color: #0A3641; margin-bottom: 15px; }
        .rx-area { width: 65%; padding-left: 20px; position: relative; }
        .footer-content { border-top: 1px solid #cccccc; padding: 15px 40px; display: flex; justify-content: space-between; font-size: 10px; color: #666666; }
      `}</style>

      <div className="iqbal-template">
        <div className="decor-top">
          <div className="skew-top bg-dark" style={{ width: "6%", marginLeft: "-20px" }}></div>
          <div className="skew-top bg-light" style={{ width: "35%" }}></div>
          <div className="skew-top bg-dark" style={{ width: "5%" }}></div>
          <div style={{ flexGrow: 1 }}></div>
          <div className="skew-top bg-dark" style={{ width: "25%", marginRight: "-20px" }}></div>
        </div>
        <div className="header-content">
          <div className="w-1/3">
            <h1 className="h-title">{t.clinicName}</h1>
            <h2 className="h-subtitle">{t.homoeoCentre}</h2>
            <div className="h-desc">{t.tagline}</div>
          </div>
          <div className="w-1/3 flex justify-center">
            <div className="w-12 h-12 border-2 border-[#159895] rounded-full flex items-center justify-center">
              <div className="relative w-6 h-6 after:absolute after:bg-[#159895] after:w-full after:h-1 after:top-2.5 after:left-0 before:absolute before:bg-[#159895] before:h-full before:w-1 before:left-2.5 before:top-0"></div>
            </div>
          </div>
          <div className="w-1/3 text-right">
            <h1 className="h-title">{t.reg}: H039162</h1>
            <h2 className="h-subtitle">{t.appt}: 8707868504</h2>
            <div className="h-desc">{t.notValid}<br />{t.valid7Days}</div>
          </div>
        </div>
        <div className="patient-table">
          <div className="p-cell"><span className="p-label">{t.date}:</span><input className="editable-field" value={date} onChange={e => setDate(e.target.value)} /></div>
          <div className="p-cell"><span className="p-label">{t.name}:</span><input className="editable-field" value={patientName} onChange={e => setPatientName(e.target.value)} /></div>
          <div className="p-cell"><span className="p-label">{t.ageSex}:</span><input className="editable-field" value={ageSex} onChange={e => setAgeSex(e.target.value)} /></div>
          <div className="p-cell"><span className="p-label">{t.dihNo}:</span><input className="editable-field" value={dihNo} onChange={e => setDihNo(e.target.value)} /></div>
        </div>
        <div className="main-body">
          <div className="sidebar">
            <div className="rx-logo">Rx</div>
            <div className="mb-6 space-y-4">
              <div className="doc-box">
                <div className="doc-name">Dr. IQBAL QUASIM</div>
                <div className="doc-qual">B.Sc, B.H.M.S., F.C.P.H.</div>
              </div>
              <div className="doc-box">
                <div className="doc-name">Dr. Gazala Parveen</div>
                <div className="doc-qual">B.H.M.S., MD (स्त्री रोग)</div>
              </div>
              <div className="doc-box">
                <div className="doc-name">Dr. Roshni Singh</div>
                <div className="doc-qual">B.H.M.S</div>
              </div>
            </div>
            <div className="hindi-section">
              <div className="hindi-title">{t.treatableTitle}</div>
              <ul className="hindi-list">{diseases.map(d => <li key={d}>{d}</li>)}</ul>
            </div>
            <div className="mt-auto pt-4 border-t border-dashed border-gray-300">
              <div className="text-xs font-bold text-[#0A3641]">{t.followUp}:</div>
              <input className="editable-field text-xs" placeholder="_________________" />
            </div>
          </div>
          <div className="rx-area">
            <div 
              ref={editorRef} 
              className="rx-content" 
              contentEditable 
              suppressContentEditableWarning 
              onInput={(e) => {
                lastContent.current = e.currentTarget.innerHTML;
                setContent(e.currentTarget.innerHTML);
              }}
              style={{ color: textColor }} 
            />
          </div>
        </div>
        <div className="footer-content">
          <div>📞 8707868504 / 8881099135</div>
          <div>🌐 www.driqbalhomoeo.com</div>
          <div>📍 14/106, Civil Lines, Kanpur</div>
        </div>
      </div>
    </div>
  );
};

const IqbalDarkTemplate = ({ content, setContent, textColor, lang }: any) => {
  const [patientName, setPatientName] = useState("Alice Thompson");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const editorRef = useRef<HTMLDivElement>(null);
  const lastContent = useRef(content);
  const t = DICTIONARY[lang as keyof typeof DICTIONARY];
  const diseases = lang === 'hi' ? HINDI_DISEASES : ENGLISH_DISEASES;

  useEffect(() => { 
    ensureFirstLine(editorRef.current); 
    if (editorRef.current && content !== lastContent.current) {
      editorRef.current.innerHTML = content || "<div><br></div>";
      lastContent.current = content;
    }
  }, [content]);

  return (
    <div className="bg-white shadow-2xl mx-auto overflow-hidden print:shadow-none print:m-0 w-full max-w-[210mm] min-h-[297mm] flex flex-col md:flex-row" style={{ fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}>
      <style>{`
        ${templateCommonStyles}
        .sidebar { width: 100%; background: #0A3641; color: white; padding: 30px 25px; display: flex; flex-direction: column; }
        @media (min-width: 768px) { .sidebar { width: 30%; } }
        .main-content { width: 100%; display: flex; flex-direction: column; position: relative; }
        @media (min-width: 768px) { .main-content { width: 70%; } }
        .h-title { color: #159895; font-size: 26px; font-weight: 800; margin: 0; }
        .h-subtitle { font-size: 11px; letter-spacing: 1.5px; color: #ccc; margin-bottom: 25px; text-transform: uppercase; }
        .hindi-title { font-size: 15px; font-weight: 900; color: #159895; margin-top: 25px; margin-bottom: 15px; border-top: 1px solid #224c58; padding-top: 20px;}
        .doc-box { margin-bottom: 20px; border-left: 3px solid #159895; padding-left: 12px; }
        .doc-name { color: #fff; font-size: 16px; font-weight: 800; }
        .doc-qual { color: #aaa; font-size: 11px; }
      `}</style>
      <div className="sidebar">
        <h1 className="h-title">{t.clinicName}</h1>
        <h2 className="h-subtitle">{t.homoeoCentre}</h2>
        <p className="text-[10px] text-gray-400 mb-8">{t.tagline}</p>
        <div className="space-y-4">
          <div className="doc-box">
            <div className="doc-name">Dr. IQBAL QUASIM</div>
            <div className="doc-qual">B.Sc, B.H.M.S.</div>
          </div>
          <div className="doc-box">
            <div className="doc-name">Dr. Gazala Parveen</div>
            <div className="doc-qual">B.H.M.S., MD (स्त्री रोग)</div>
          </div>
          <div className="doc-box">
            <div className="doc-name">Dr. Roshni Singh</div>
            <div className="doc-qual">B.H.M.S</div>
          </div>
        </div>
        <div className="hindi-title">{t.treatableTitle}</div>
        <ul className="hindi-list">{diseases.map(d => <li key={d}>{d}</li>)}</ul>
        <div className="mt-auto pt-6"><div className="text-[11px] font-bold text-gray-400">{t.followUp}:</div><input className="editable-field text-xs" placeholder="______________" /></div>
      </div>
      <div className="main-content">
        <div className="p-8 flex justify-between border-bottom border-gray-100 items-center">
          <div className="text-[#0A3641] text-lg font-bold tracking-widest">{t.prescription}</div>
          <div className="text-[9px] text-gray-500 text-right leading-tight font-bold">REG: H039162 | {t.appt}: 8707868504<br />{t.valid7Days}</div>
        </div>
        <div className="bg-gray-50 grid grid-cols-2">
          <div className="p-4 border-r border-gray-200"><span className="text-[10px] text-gray-400 uppercase font-bold block">{t.date}</span><input className="editable-field text-sm" value={date} onChange={e => setDate(e.target.value)} /></div>
          <div className="p-4"><span className="text-[10px] text-gray-400 uppercase font-bold block">{t.name}</span><input className="editable-field text-sm" value={patientName} onChange={e => setPatientName(e.target.value)} /></div>
        </div>
        <div className="flex-1 p-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] text-gray-100 font-bold pointer-events-none">✚</div>
          <div className="text-[#159895] text-4xl font-serif font-bold mb-4">Rx</div>
          <div 
            ref={editorRef} 
            className="rx-content" 
            contentEditable 
            suppressContentEditableWarning 
            onInput={(e) => {
              lastContent.current = e.currentTarget.innerHTML;
              setContent(e.currentTarget.innerHTML);
            }}
            style={{ color: textColor }} 
          />
        </div>
        <div className="p-8 bg-gray-50 border-t-2 border-[#159895] flex justify-between text-[10px]">
          <div>📞 8707868504</div>
          <div>🌐 www.driqbalhomoeo.com</div>
          <div>📍 14/106, Kanpur</div>
        </div>
      </div>
    </div>
  );
};

const IqbalModernTemplate = ({ content, setContent, textColor, lang }: any) => {
  const [patientName, setPatientName] = useState("Alice Thompson");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const editorRef = useRef<HTMLDivElement>(null);
  const lastContent = useRef(content);
  const t = DICTIONARY[lang as keyof typeof DICTIONARY];
  const diseases = lang === 'hi' ? HINDI_DISEASES : ENGLISH_DISEASES;

  useEffect(() => { 
    ensureFirstLine(editorRef.current); 
    if (editorRef.current && content !== lastContent.current) {
      editorRef.current.innerHTML = content || "<div><br></div>";
      lastContent.current = content;
    }
  }, [content]);

  return (
    <div className="bg-white shadow-2xl mx-auto overflow-hidden print:shadow-none print:m-0 w-full max-w-[210mm] min-h-[297mm] p-8 flex flex-col" style={{ fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}>
      <style>{`
        ${templateCommonStyles}
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
        .h-title { color: #0A3641; font-size: 26px; font-weight: 800; margin: 0; }
        .h-subtitle { color: #159895; font-size: 13px; font-weight: bold; margin: 0; }
        .patient-info { display: flex; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin-bottom: 25px; background: #fdfdfd; }
        .p-item { flex: 1; padding: 12px 15px; border-right: 1px solid #ddd; font-size: 12px; }
        .p-item:last-child { border-right: none; }
        .p-label { color: #888; font-size: 9px; display: block; margin-bottom: 4px; text-transform: uppercase; font-weight: 800; }
        .sidebar { width: 30%; border-right: 1px solid #eee; padding-right: 20px; }
        .disease-title { font-size: 15px; font-weight: 900; color: #0A3641; margin-bottom: 15px; text-transform: uppercase; border-bottom: 2px solid #159895; display: inline-block; padding-bottom: 4px; }
        .rx-container { flex: 1; padding-left: 20px; position: relative; }
        .rx-logo { color: #0A3641; font-size: 32px; font-weight: bold; font-family: serif; margin-bottom: 15px; }
        .footer { display: flex; justify-content: space-between; font-size: 10px; color: #666; padding-top: 20px; border-top: 1px solid #eee; margin-top: auto; }
        .doc-info { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #eee; }
      `}</style>
      <div className="header">
        <div><h1 className="h-title">{t.clinicName}</h1><h2 className="h-subtitle">{t.homoeoCentre}</h2><p className="text-[10px] text-gray-500 mt-2">{t.tagline}</p></div>
        <div className="bg-gray-50 p-3 rounded-lg text-[9px] font-bold text-gray-600 text-right">REG: H039162 | {t.appt}: 8707868504<br />{t.valid7Days}</div>
      </div>
      <div className="patient-info">
        <div className="p-item"><span className="p-label">{t.date}</span><input className="editable-field" value={date} onChange={e => setDate(e.target.value)} /></div>
        <div className="p-item" style={{ flex: 2 }}><span className="p-label">{t.patientName}</span><input className="editable-field" value={patientName} onChange={e => setPatientName(e.target.value)} /></div>
        <div className="p-item"><span className="p-label">{t.dihNo}</span><input className="editable-field" placeholder="____" /></div>
      </div>
      <div className="flex flex-1 gap-4 overflow-hidden">
        <div className="sidebar">
          <div className="doc-info space-y-4">
             <div className="doc-box">
               <div className="doc-name">Dr. IQBAL QUASIM</div>
               <div className="doc-qual">B.Sc, B.H.M.S.</div>
             </div>
             <div className="doc-box">
               <div className="doc-name">Dr. Gazala Parveen</div>
               <div className="doc-qual">B.H.M.S., MD (स्त्री रोग)</div>
             </div>
             <div className="doc-box">
               <div className="doc-name">Dr. Roshni Singh</div>
               <div className="doc-qual">B.H.M.S</div>
             </div>
          </div>
          <h3 className="disease-title">{t.specialization}</h3>
          <ul className="hindi-list">{diseases.map(d => <li key={d}>{d}</li>)}</ul>
          <div className="mt-8 pt-4 border-t border-gray-100"><span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">{t.followUp}</span><input className="editable-field" placeholder="________" /></div>
        </div>
        <div className="rx-container">
          <div className="rx-logo">Rx</div>
          <div 
            ref={editorRef} 
            className="rx-content" 
            contentEditable 
            suppressContentEditableWarning 
            onInput={(e) => {
              lastContent.current = e.currentTarget.innerHTML;
              setContent(e.currentTarget.innerHTML);
            }}
            style={{ color: textColor }} 
          />
        </div>
      </div>
      <div className="footer">
        <div>📞 8707868504</div>
        <div>🌐 driqbalhomoeo.com</div>
        <div>📍 14/106, Kanpur - 208001</div>
      </div>
    </div>
  );
};

const IqbalHospitalTemplate = ({ content, setContent, textColor, lang }: any) => {
  const [patientName, setPatientName] = useState("Alice Thompson");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const editorRef = useRef<HTMLDivElement>(null);
  const lastContent = useRef(content);
  const t = DICTIONARY[lang as keyof typeof DICTIONARY];
  const diseases = lang === 'hi' ? HINDI_DISEASES : ENGLISH_DISEASES;

  useEffect(() => { 
    ensureFirstLine(editorRef.current); 
    if (editorRef.current && content !== lastContent.current) {
      editorRef.current.innerHTML = content || "<div><br></div>";
      lastContent.current = content;
    }
  }, [content]);

  return (
    <div className="bg-white shadow-2xl mx-auto overflow-hidden print:shadow-none print:m-0 w-full max-w-[210mm] min-h-[297mm] flex flex-col" style={{ fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}>
      <style>{`
        ${templateCommonStyles}
        .hero { background: #eff7f7; padding: 30px 40px; border-bottom: 4px solid #fe5d5d; }
        .h-title { color: #f7a4a4; font-size: 32px; font-weight: 900; margin: 0; line-height: 1; }
        .h-subtitle { color: #fe5d5d; font-size: 14px; font-weight: bold; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px; }
        .strip { background: #f7a4a4; color: white; display: flex; padding: 10px 40px; font-size: 11px; font-weight: bold; }
        .p-field { flex: 1; display: flex; gap: 8px; }
        .p-field span { opacity: 0.8; }
        .main { display: flex; flex-grow: 1; padding: 30px 40px; }
        .sidebar { width: 35%; border-right: 1px solid #eee; padding-right: 25px; }
        .hindi-title { font-size: 15px; font-weight: 900; color: #f7a4a4; background: #fff; padding: 6px 0; border-bottom: 2px solid #fe5d5d; margin-bottom: 15px; text-transform: uppercase; }
        .footer { padding: 20px 40px; background: #fff; border-top: 1px solid #eee; display: flex; justify-content: space-between; font-size: 10px; color: #777; margin-top: auto; }
        .doc-section { display: flex; gap: 20px; }
        .doc-box { flex: 1; }
        .doc-name { color: #f7a4a4; font-size: 16px; font-weight: 800; }
        .doc-qual { font-size: 11px; }
      `}</style>
      <div className="hero">
        <div className="flex justify-between items-start mb-6">
          <div><h1 className="h-title">{t.clinicName}</h1><h2 className="h-subtitle">{t.homoeoCentre}</h2><p className="text-[10px] text-gray-500 mt-2">{t.tagline}</p></div>
          <div className="text-right text-[9px] font-black text-gray-400 tracking-wider">REG: H039162 | {t.appt}: 8707868504<br />{t.valid7Days}</div>
        </div>
        <div className="doc-section">
          <div className="doc-box">
            <div className="doc-name">Dr. IQBAL QUASIM</div>
            <div className="doc-qual">B.Sc, B.H.M.S.</div>
          </div>
          <div className="doc-box">
            <div className="doc-name">Dr. Gazala Parveen</div>
            <div className="doc-qual">B.H.M.S., MD (स्त्री रोग)</div>
          </div>
          <div className="doc-box">
            <div className="doc-name">Dr. Roshni Singh</div>
            <div className="doc-qual">B.H.M.S</div>
          </div>
        </div>
      </div>
      <div className="strip">
        <div className="p-field"><span>{t.date}:</span> <input className="editable-field" value={date} onChange={e => setDate(e.target.value)} /></div>
        <div className="p-field" style={{ flex: 2 }}><span>{t.patientName}:</span> <input className="editable-field" value={patientName} onChange={e => setPatientName(e.target.value)} /></div>
        <div className="p-field"><span>{t.dihNo}:</span> <input className="editable-field" placeholder="____" /></div>
      </div>
      <div className="main">
        <div className="sidebar">
          <div className="hindi-title">{t.treatableTitle}</div>
          <ul className="hindi-list">{diseases.map(d => <li key={d}>{d}</li>)}</ul>
          <div className="mt-12"><div className="text-[11px] font-bold text-gray-300 uppercase">{t.followUp}:</div><input className="editable-field text-xs" placeholder="________________" /></div>
        </div>
        <div className="flex-1 pl-8 relative">
          <div className="text-[#fe5d5d] text-4xl font-serif font-bold italic">Rx</div>
          <div 
            ref={editorRef} 
            className="rx-content" 
            contentEditable 
            suppressContentEditableWarning 
            onInput={(e) => {
              lastContent.current = e.currentTarget.innerHTML;
              setContent(e.currentTarget.innerHTML);
            }}
            style={{ color: textColor }} 
          />
        </div>
      </div>
      <div className="footer">
        <div>📞 8707868504 / 8881099135</div>
        <div>🌐 driqbalhomoeo.com</div>
        <div>📍 14/106, Kanpur - 208001</div>
      </div>
    </div>
  );
};

export default function NewLetterPage() {
  const [template, setTemplate] = useState("iqbal");
  const [content, setContent] = useState("<div><br></div>");
  const [textColor, setTextColor] = useState("#000000");
  const [language, setLanguage] = useState("en");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const updateFormatState = () => {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
    };
    document.addEventListener('selectionchange', updateFormatState);
    return () => document.removeEventListener('selectionchange', updateFormatState);
  }, []);

  const handlePrint = () => { window.print(); };

  const handleSave = () => {
    toast({
      title: "Draft Saved",
      description: "Clinical letter has been saved to your clinical database.",
    });
  };

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    // Force immediate re-check of states
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background print:bg-white">
      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; background-color: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          #print-area { display: block !important; position: fixed; top: 0; left: 0; width: 210mm; height: 297mm; z-index: 9999; }
          main { display: none !important; }
          .no-print { display: none !important; }
        }
        #print-area { display: none; }
      `}</style>
      
      <div className="print:hidden"><MediMenuBar /></div>
      <div className="bg-card border-b shadow-sm sticky top-[65px] z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
           <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
             <Button variant="ghost" size="icon" asChild><Link href="/dashboard"><ChevronLeft className="h-5 w-5" /></Link></Button>
             <div className="flex flex-col">
               <h1 className="text-sm sm:text-lg font-headline font-bold text-primary truncate">Clinical Editor</h1>
               <div className="flex items-center gap-2 mt-0.5">
                 <Select value={template} onValueChange={setTemplate}>
                   <SelectTrigger className="h-6 w-auto max-w-[120px] sm:max-w-[200px] text-[10px] uppercase font-bold tracking-wider border-none bg-transparent p-0"><SelectValue /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="iqbal">Geometric Original</SelectItem>
                     <SelectItem value="iqbal-dark">Dark Sidebar Edition</SelectItem>
                     <SelectItem value="iqbal-modern">Modern Grid Layout</SelectItem>
                     <SelectItem value="iqbal-hospital">Hospital Header Layout</SelectItem>
                   </SelectContent>
                 </Select>
                 <Separator orientation="vertical" className="h-3" />
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   className="h-6 px-1.5 flex items-center gap-1 hover:bg-primary/10" 
                   onMouseDown={(e) => { e.preventDefault(); setLanguage(l => l === 'en' ? 'hi' : 'en'); }}
                 >
                   <Languages className="h-3 w-3 text-primary" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{language === 'en' ? 'EN' : 'HI'}</span>
                 </Button>
               </div>
             </div>
           </div>

           <div className="flex items-center gap-1.5 sm:gap-3">
             <div className="flex items-center bg-muted/30 rounded-md p-0.5">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-7 w-7 sm:h-8 sm:w-8", isBold && "bg-primary/10 border border-primary/30 shadow-inner")} 
                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('bold'); }}
                >
                  <Bold className={cn("h-3.5 w-3.5", isBold && "text-primary")} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-7 w-7 sm:h-8 sm:w-8", isItalic && "bg-primary/10 border border-primary/30 shadow-inner")} 
                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('italic'); }}
                >
                  <Italic className={cn("h-3.5 w-3.5", isItalic && "text-primary")} />
                </Button>
             </div>
             
             <Select onValueChange={(val) => applyFormatting('fontSize', val)}>
               <SelectTrigger className="h-7 w-[60px] sm:w-[80px] text-[10px] font-bold border-none bg-muted/50 hidden xs:flex"><SelectValue placeholder="Size" /></SelectTrigger>
               <SelectContent>{FONT_SIZES.map(size => (<SelectItem key={size.value} value={size.value}>{size.name}</SelectItem>))}</SelectContent>
             </Select>

             <Popover>
               <PopoverTrigger asChild><Button variant="ghost" size="sm" className="h-7 p-0 px-2 gap-2 flex items-center hover:bg-muted/50 rounded-md" onMouseDown={(e) => e.preventDefault()}><div className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: textColor }} /><span className="text-[10px] uppercase font-bold tracking-wider hidden sm:inline">Color</span></Button></PopoverTrigger>
               <PopoverContent className="w-40 p-2" align="start"><div className="grid grid-cols-3 gap-2">{COLOR_PRESETS.map((color) => (<button key={color.value} className={cn("h-8 w-8 rounded-md border border-border", textColor === color.value && "ring-2 ring-primary ring-offset-1")} style={{ backgroundColor: color.value }} onMouseDown={(e) => { e.preventDefault(); setTextColor(color.value); applyFormatting('foreColor', color.value); }} />))}</div></PopoverContent>
             </Popover>

             <Separator orientation="vertical" className="h-6 hidden sm:block" />
             <Button size="sm" variant="default" className="h-8 sm:h-9 text-xs bg-primary hover:bg-primary/90 shadow-sm" onMouseDown={(e) => { e.preventDefault(); handleSave(); }}><Save className="mr-1.5 h-3.5 w-3.5" /> Save</Button>
             <Button size="sm" variant="outline" className="h-8 sm:h-9 text-xs border-primary text-primary hover:bg-primary/5" onMouseDown={(e) => { e.preventDefault(); handlePrint(); }}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
           </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6 flex flex-col items-center">
          <div className="w-full transform transition-all duration-300">
            {template === "iqbal" && <IqbalTemplate content={content} setContent={setContent} textColor={textColor} lang={language} />}
            {template === "iqbal-dark" && <IqbalDarkTemplate content={content} setContent={setContent} textColor={textColor} lang={language} />}
            {template === "iqbal-modern" && <IqbalModernTemplate content={content} setContent={setContent} textColor={textColor} lang={language} />}
            {template === "iqbal-hospital" && <IqbalHospitalTemplate content={content} setContent={setContent} textColor={textColor} lang={language} />}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <AILetterAssistant onDraftGenerated={(draft) => setContent(`<div>${draft.replace(/\n/g, '</div><div>')}</div>`)} />
          <Card className="border-none ring-1 ring-border shadow-sm hidden lg:block">
            <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-bold flex items-center gap-2 text-primary"><Users className="h-4 w-4" />Linked Patient</CardTitle></CardHeader>
            <CardContent className="space-y-4 p-4 pt-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-bold">Alice Thompson</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">ID</span><span className="font-bold">#88219</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Blood Group</span><span className="font-bold text-destructive">A+</span></div>
            </CardContent>
          </Card>
        </div>
      </main>

      <div id="print-area">
        {template === "iqbal" && <IqbalTemplate content={content} setContent={setContent} textColor={textColor} lang={language} />}
        {template === "iqbal-dark" && <IqbalDarkTemplate content={content} setContent={setContent} textColor={textColor} lang={language} />}
        {template === "iqbal-modern" && <IqbalModernTemplate content={content} setContent={setContent} textColor={textColor} lang={language} />}
        {template === "iqbal-hospital" && <IqbalHospitalTemplate content={content} setContent={setContent} textColor={textColor} lang={language} />}
      </div>
    </div>
  );
}
