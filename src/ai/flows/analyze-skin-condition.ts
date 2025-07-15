'use server';

/**
 * @fileOverview AI agent to analyze skin condition from a photo.
 *
 * - analyzeSkinCondition - Analyzes skin condition and identifies concerns.
 * - AnalyzeSkinConditionInput - Input type for analyzeSkinCondition function.
 * - AnalyzeSkinConditionOutput - Return type for analyzeSkinCondition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSkinConditionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeSkinConditionInput = z.infer<typeof AnalyzeSkinConditionInputSchema>;

const AnalyzeSkinConditionOutputSchema = z.object({
  concerns: z
    .array(z.string())
    .describe('A list of identified skin concerns, such as dryness, oiliness, acne, wrinkles, etc.'),
  report: z.string().describe('A detailed report assessing the skin condition.'),
});
export type AnalyzeSkinConditionOutput = z.infer<typeof AnalyzeSkinConditionOutputSchema>;

export async function analyzeSkinCondition(input: AnalyzeSkinConditionInput): Promise<AnalyzeSkinConditionOutput> {
  return analyzeSkinConditionFlow(input);
}

const analyzeSkinConditionPrompt = ai.definePrompt({
  name: 'analyzeSkinConditionPrompt',
  input: {schema: AnalyzeSkinConditionInputSchema},
  output: {schema: AnalyzeSkinConditionOutputSchema},
  prompt: `You are a skincare analysis expert. Analyze the provided face photo and identify skin concerns.

  Photo: {{media url=photoDataUri}}

  Based on the photo, generate a detailed report assessing the skin's condition and list specific skin concerns.
  The report should include potential issues and factors affecting skin health.
  List all skin concerns found. Examples: acne, wrinkles, dryness, oiliness, sun damage
  Do not make up skin concerns that are not visible in the photo.
  If the photo does not contain a face, return that in the report and return an empty array for concerns.
  `,
});

const analyzeSkinConditionFlow = ai.defineFlow(
  {
    name: 'analyzeSkinConditionFlow',
    inputSchema: AnalyzeSkinConditionInputSchema,
    outputSchema: AnalyzeSkinConditionOutputSchema,
  },
  async input => {
    const {output} = await analyzeSkinConditionPrompt(input);
    return output!;
  }
);
