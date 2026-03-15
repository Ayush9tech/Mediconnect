'use server';
/**
 * @fileOverview A Genkit flow to assist doctors in drafting consultation letters.
 *
 * - draftLetter - A function that handles the AI-powered drafting of a consultation letter.
 * - DraftLetterInput - The input type for the draftLetter function.
 * - DraftLetterOutput - The return type for the draftLetter function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DraftLetterInputSchema = z.object({
  patientDetails: z.object({
    patientName: z.string().describe('The full name of the patient.'),
    patientAge: z.number().optional().describe('The age of the patient.'),
    patientGender: z.string().optional().describe('The gender of the patient.'),
    patientDiagnosis: z.string().optional().describe('The primary diagnosis for the patient.'),
    patientHistory: z.string().optional().describe('Relevant medical history of the patient.'),
    // Add other relevant patient details as needed
  }).describe('Detailed information about the patient.'),
  templateContent: z.string().describe('The content of the chosen consultation letter template.'),
});
export type DraftLetterInput = z.infer<typeof DraftLetterInputSchema>;

const DraftLetterOutputSchema = z.object({
  draftedLetter: z.string().describe('The AI-generated draft of the consultation letter.'),
});
export type DraftLetterOutput = z.infer<typeof DraftLetterOutputSchema>;

export async function draftLetter(input: DraftLetterInput): Promise<DraftLetterOutput> {
  return draftLetterFlow(input);
}

const draftLetterPrompt = ai.definePrompt({
  name: 'draftLetterPrompt',
  input: { schema: DraftLetterInputSchema },
  output: { schema: DraftLetterOutputSchema },
  prompt: `You are an AI assistant specialized in drafting medical consultation letters.
Your goal is to use the provided patient details to populate and complete the given template content, ensuring all relevant information is integrated naturally and professionally.

Here are the patient details:
Patient Name: {{{patientDetails.patientName}}}
{{#if patientDetails.patientAge}}Patient Age: {{{patientDetails.patientAge}}}{{/if}}
{{#if patientDetails.patientGender}}Patient Gender: {{{patientDetails.patientGender}}}{{/if}}
{{#if patientDetails.patientDiagnosis}}Patient Diagnosis: {{{patientDetails.patientDiagnosis}}}{{/if}}
{{#if patientDetails.patientHistory}}Patient History: {{{patientDetails.patientHistory}}}{{/if}}


Here is the consultation letter template to fill in:
---
{{{templateContent}}}
---

Draft the complete consultation letter based on the patient details and the template. Ensure the tone is professional and clinical. Focus on generating the full body of the letter.`,
});

const draftLetterFlow = ai.defineFlow(
  {
    name: 'draftLetterFlow',
    inputSchema: DraftLetterInputSchema,
    outputSchema: DraftLetterOutputSchema,
  },
  async (input) => {
    const { output } = await draftLetterPrompt(input);
    return output!;
  }
);
