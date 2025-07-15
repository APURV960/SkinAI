'use server';

/**
 * @fileOverview Generates a detailed skin report based on AI analysis of a user-uploaded photo.
 *
 * - generateSkinReport - A function that handles the skin report generation process.
 * - GenerateSkinReportInput - The input type for the generateSkinReport function.
 * - GenerateSkinReportOutput - The return type for the generateSkinReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSkinReportInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateSkinReportInput = z.infer<typeof GenerateSkinReportInputSchema>;

const GenerateSkinReportOutputSchema = z.object({
  report: z.string().describe('A detailed report assessing the user’s skin condition, explaining identified concerns and their potential causes.'),
});
export type GenerateSkinReportOutput = z.infer<typeof GenerateSkinReportOutputSchema>;

export async function generateSkinReport(input: GenerateSkinReportInput): Promise<GenerateSkinReportOutput> {
  return generateSkinReportFlow(input);
}

const generateSkinReportPrompt = ai.definePrompt({
  name: 'generateSkinReportPrompt',
  input: {schema: GenerateSkinReportInputSchema},
  output: {schema: GenerateSkinReportOutputSchema},
  prompt: `You are an AI skincare advisor. Analyze the user's facial skin based on the uploaded photo and generate a detailed report.

  Explain identified concerns and their potential causes in a clear and concise manner.

  Photo: {{media url=photoDataUri}}`,
});

const generateSkinReportFlow = ai.defineFlow(
  {
    name: 'generateSkinReportFlow',
    inputSchema: GenerateSkinReportInputSchema,
    outputSchema: GenerateSkinReportOutputSchema,
  },
  async input => {
    const {output} = await generateSkinReportPrompt(input);
    return output!;
  }
);
