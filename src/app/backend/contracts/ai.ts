import {OpenAI} from 'openai'
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

// Define the interface for the AI service
export interface AIService {
    findUrlsBasedOnKeywordsProvided(keywords: string[], sitemap: string[]): Promise<any>;

    generateHnStructure(keywords: string[]): Promise<HnAndMetaStructure>;
}

// Implement the OpenAI service
export const openAIService = (apiKey: any): AIService => ({
    async findUrlsBasedOnKeywordsProvided(keywords: string[], sitemap: string[]): Promise<any> {
        if (!apiKey) throw new Error('OpenAI API Key is missing');


        const openai = new OpenAI(
            {
                apiKey
            }
        );

        // Configure the OpenAI client

        const messages: ChatCompletionMessageParam[] = [
            {role: "system", content: "You are a scraping assistant that return only json."},
            {
                role: 'system',
                content: "I will provide you with a sitemap and a set of keywords. Based on this data, I want you to generate a JSON array where for each keyword you can find 5 relevant urls on the list of urls i will provide. Your response should strictly adhere to the following format without any explanations or additional text:\n" +
                    "\n" +
                    "[\n" +
                    "  {\n" +
                    "    \"keyword\": \"example_keyword\",\n" +
                    "    \"url\": \"example_url\"\n" +
                    "  },\n" +
                    "  ...\n" +
                    "]\n" +
                    "\n" +
                    JSON.stringify({
                        keywords,
                        sitemap
                    }) + 'Based on this data, provide relevant URLs in JSON format only. ' +
                    'No markup neither (like ```json```for example) and no further explanation\n',
            }
        ];
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
        });
        return completion.choices[0].message.content;
    },
    async generateHnStructure(keywords: string[]): Promise<HnAndMetaStructure> {

        if (!apiKey) throw new Error('OpenAI API Key is missing');


        const openai = new OpenAI(
            {
                apiKey
            }
        );

        // Configure the OpenAI client

        const messages: ChatCompletionMessageParam[] = [
            {
                role: 'system',
                content: `You are an SEO expert. 

For the keyword "${keywords[0]}", write an optimized *Title*, a short *meta-description* that entices clicks (for a content page, not e-commerce), and a detailed outline containing an *H1* and *several structured* *H2* or *H3* sections *WITHOUT* conclusion. 

Use the following exact format and ensure all content is in French:

{
  "title": "string",
  "meta_description": "string",
  "structure": {
    "H1": "string",
    "sections": [
      {
        "H2 or H3 heading": ["string or list of strings"]
      }
    ]
  }
}

Respond with valid JSON only. Do not include any explanations, comments, or any other text outside the JSON structure.`
            }

        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
        });
        return JSON.parse(<string>completion.choices[0].message.content);
    }
});


export type HnAndMetaStructure = {
    title: string,
    meta_description: string,
    structure: Structure
}

type Structure = {
    H1: string,
    sections: Array<Section>
}

type Section = {
    [key: string]: string | string[]
}


