import {ChatCompletionResponse} from "@mistralai/mistralai/models/components";
import {Mistral} from "@mistralai/mistralai";

export interface AIService {
    findUrlsBasedOnKeywordsProvided(keywords: string[], sitemap: string[]): Promise<ChatCompletionResponse>;
}

export const mistralService: AIService = {
    async findUrlsBasedOnKeywordsProvided(keywords: string[], sitemap: string[]): Promise<ChatCompletionResponse> {
        const apiKey = process.env.MISTRAL_API_KEY;
        const agentId = process.env.MISTAL_SITEMAP_AGENT_ID;

        if (!apiKey || !agentId) throw new Error('Mistral API Key or Agent ID is missing');

        const client = new Mistral({apiKey});
        // Assuming you would implement the API call here, replaced with a mock response for now


        return await client.agents.complete({
            agentId,
            messages: [{
                role: 'user',
                content: JSON.stringify({
                    keywords,
                    sitemap
                }) + 'Based on this data, answer only with the JSON format specified above.\n',
            }
            ]
        });

    },
};