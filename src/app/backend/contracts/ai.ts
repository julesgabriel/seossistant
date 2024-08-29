import {OpenAI} from 'openai'
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

// Define the interface for the AI service
export interface AIService {
    findUrlsBasedOnKeywordsProvided(keywords: string[], sitemap: string[]): Promise<any>;
}

// Implement the OpenAI service
export const openAIService: AIService = {
    async findUrlsBasedOnKeywordsProvided(keywords: string[], sitemap: string[]): Promise<any> {
        const apiKey = process.env.OPENAI_API_KEY;

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
                    "Do not show markup neither (like ```json ``` for example) " + JSON.stringify({
                    keywords,
                    sitemap
                }) + 'Based on this data, provide relevant URLs in JSON format only.\n',
            }
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
        });

        console.log('OOOOH', completion, completion.choices)
        // Return the response from OpenAI
        return completion.choices[0].message.content;
    },
};
