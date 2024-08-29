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
                    "Do not show any further explanation nor text inly the json" +
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
            {role: "system", content: "You are an SEO expert."},
            {
                role: 'system',
                content: `For the keyword ${keywords[0]}, write an optimized Title, a short meta-description that entices clicks (for a content page, not e-commerce), and a detailed outline containing an H1 and several structured H2 or H3 sections. Clearly specify which parts are H2 and which are H3. Everything should be in French. Based on this data, provide relevant URLs in JSON format only. Do not show markup neither (like \`\`\`json \`\`\` for example)` +
                    "Here is the format i want for example:" +
                    "type HnAndMetaStructure = {\n" +
                    "    title: string,\n" +
                    "    meta_description: string,\n" +
                    "    structure: Structure\n" +
                    "}\n" +
                    "\n" +
                    "type Structure = {\n" +
                    "    H1: string,\n" +
                    "    sections: Array<Section>\n" +
                    "}\n" +
                    "\n" +
                    "type Section = {\n" +
                    "    [key: string]: string | string[]\n" +
                    "}"
                ,
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


