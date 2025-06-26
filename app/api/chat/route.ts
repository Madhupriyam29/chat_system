import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    toolCallStreaming: true,
    model: openai('gpt-4o'),
    messages,
    tools: {
      // server-side tool with execute function:
      getWeatherInformation: {
        description: 'show the weather in a given city to the user',
        parameters: z.object({ city: z.string() }),
        execute: async ({}: { city: string }) => {
          const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
          return weatherOptions[
            Math.floor(Math.random() * weatherOptions.length)
          ];
        },
      },
      
      // New Supreme Court Information tool
      getSupremeCourtInformation: {
        description: 'get information about a supreme court case',
        parameters: z.object({ case: z.string() }),
        execute: async ({}: { case: string }) => {
          const caseInformation = [
            'The Supreme Court ruled in favor of the plaintiff.',
            'The Supreme Court ruled in favor of the defendant.',
            'The Supreme Court remanded the case back to the lower court.',
            'The Supreme Court dismissed the case.',
            'The Supreme Court issued a split decision.',
            'The case is still pending before the Supreme Court.'
          ];
          return caseInformation[
            Math.floor(Math.random() * caseInformation.length)
          ];
        },
      },
      
      // client-side tool that starts user interaction:
      askForConfirmation: {
        description: 'Ask the user for confirmation.',
        parameters: z.object({
          message: z.string().describe('The message to ask for confirmation.'),
        }),
      },

      
      // client-side tool that is automatically executed on the client:
      getLocation: {
        description:
          'Get the user location. Always ask for confirmation before using this tool.',
        parameters: z.object({}),
      },
    },
  });

  return result.toDataStreamResponse();
}