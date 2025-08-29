'use server';
/**
 * @fileOverview Genkit flow for generating human-readable explanations of risk predictions.
 *
 * - explainPrediction - A function that generates an explanation for a given risk prediction.
 * - ExplainPredictionInput - The input type for the explainPrediction function, including prediction and contributing factors.
 * - ExplainPredictionOutput - The return type for the explainPrediction function, providing a human-readable explanation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainPredictionInputSchema = z.object({
  prediction: z.string().describe('The risk prediction to explain.'),
  factors: z.record(z.string(), z.number()).describe('The factors contributing to the risk prediction, with their corresponding weights.'),
});
export type ExplainPredictionInput = z.infer<typeof ExplainPredictionInputSchema>;

const ExplainPredictionOutputSchema = z.object({
  explanation: z.string().describe('A human-readable explanation of why the prediction was made, based on the contributing factors.'),
});
export type ExplainPredictionOutput = z.infer<typeof ExplainPredictionOutputSchema>;

export async function explainPrediction(input: ExplainPredictionInput): Promise<ExplainPredictionOutput> {
  return explainPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainPredictionPrompt',
  input: {schema: ExplainPredictionInputSchema},
  output: {schema: ExplainPredictionOutputSchema},
  prompt: `You are an AI assistant that explains medical risk predictions to doctors.

  Given a risk prediction and the factors that contributed to it, generate a human-readable explanation of why the prediction was made.

  Prediction: {{{prediction}}}

  Contributing Factors:
  {{#each factors}}
  - {{key}}: {{value}}
  {{/each}}

  Explanation: `,
});

const explainPredictionFlow = ai.defineFlow(
  {
    name: 'explainPredictionFlow',
    inputSchema: ExplainPredictionInputSchema,
    outputSchema: ExplainPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
