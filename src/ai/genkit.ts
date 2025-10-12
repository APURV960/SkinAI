// import {genkit} from 'genkit';
// import {googleAI} from '@genkit-ai/googleai';

// export const ai = genkit({
//   // plugins: [googleAI()],
//   plugins: [googleAI({ apiVersion: 'v1' })], 
//   model: 'models/gemini-1.5-pro', 
// });

// import { genkit } from 'genkit';
// import { googleAI } from '@genkit-ai/googleai';
// import dotenv from 'dotenv';

// dotenv.config(); // Load environment variables from .env

// export const ai = genkit({
//   plugins: [googleAI({ 
//     apiVersion: 'v1', 
//     apiKey: process.env.GOOGLE_API_KEY 
//   })],
//   model: 'models/gemini-2.5-pro', // Use the model your API key can access
// });



import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
