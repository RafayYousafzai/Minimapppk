// This is an AI-powered product recommendation flow that suggests additional products based on the current items in the user's cart.
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const ProductSchema = z.object({
  id: z.string().describe('The unique identifier of the product.'),
  name: z.string().describe('The name of the product.'),
  description: z.string().describe('A brief description of the product.'),
  imageUrl: z.string().describe('URL of the product image.'),
  price: z.number().describe('The price of the product.'),
});

const AIProductRecommendationsInputSchema = z.object({
  cartItems: z.array(ProductSchema).describe('The products currently in the user\'s cart.'),
  maxRecommendations: z.number().default(3).describe('Maximum number of product recommendations to return.'),
});
export type AIProductRecommendationsInput = z.infer<typeof AIProductRecommendationsInputSchema>;

const AIProductRecommendationsOutputSchema = z.array(ProductSchema).describe('Recommended products based on the cart items.');
export type AIProductRecommendationsOutput = z.infer<typeof AIProductRecommendationsOutputSchema>;

export async function generateAIProductRecommendations(input: AIProductRecommendationsInput): Promise<AIProductRecommendationsOutput> {
  return aiProductRecommendationsFlow(input);
}

const shouldStopTool = ai.defineTool({
  name: 'shouldStopTool',
  description: 'This tool is used to check if the LLM has provided sufficient recommendations, return true if enough recommendations are provided, otherwise return false.',
  inputSchema: z.object({
    recommendations: z.array(ProductSchema).describe('The list of current recommendations'),
    maxRecommendations: z.number().describe('The maxiumum number of recommendations that can be made'),
  }),
  outputSchema: z.boolean(), // Returning a boolean indicating whether to stop or not
  async implementation(input) {
    return input.recommendations.length >= input.maxRecommendations;
  },
});

const productRecommendationPrompt = ai.definePrompt({
  name: 'productRecommendationPrompt',
  input: {schema: AIProductRecommendationsInputSchema},
  output: {schema: AIProductRecommendationsOutputSchema},
  tools: [shouldStopTool],
  prompt: `Based on the items currently in the user's cart, recommend additional products that the user might be interested in.

  Cart Items:
  {{#each cartItems}}
  - Name: {{this.name}}, Description: {{this.description}}, Price: {{this.price}}
  {{/each}}

  Return a list of products that complement or are related to the items in the cart. Limit the number of recommendations to {{maxRecommendations}}.

  Consider the following when making recommendations:
  - Products that are frequently bought together with the items in the cart.
  - Products that are similar to the items in the cart.
  - Products that the user has shown interest in previously.

  Only recommend products that are in stock and available for purchase.

  Ensure that the products are relevant and of high quality.

  If the tool indicates there are enough recommendations, then immediately return.`, // Instructions to use the tool
});


const aiProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiProductRecommendationsFlow',
    inputSchema: AIProductRecommendationsInputSchema,
    outputSchema: AIProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await productRecommendationPrompt(input);
    return output!;
  }
);
