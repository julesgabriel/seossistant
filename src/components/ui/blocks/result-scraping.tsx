import {ScrapingResult} from "@/app/scrape-refund/page";
import Link from "next/link";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {CornerDownLeft} from "lucide-react";

export function ResultScraping(result: ScrapingResult, searchedValue: string) {
    return (
        <div className="mt-8">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Résultats</h2>

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">
                    Résultats de la SERP pour le mot-clé{" "}
                    <span className="text-primary">{searchedValue}</span>
                </h3>
                <ul className="list-decimal pl-5 space-y-2">
                    {result.response.map((item: string, index: number) => (
                        <li key={index} className="break-words">
                            <Link href={item} className="text-blue-600 hover:underline">
                                {item}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Questions fréquentes</h3>
                <ul className="list-disc pl-5 space-y-2">
                    {result.peopleAlsoAskQuestions.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Suggestion de maillage interne</h3>
                <ul className="list-disc pl-5 space-y-2">
                    {result.maillage.map((item: any, index: number) => (
                        <li key={index}>
                            <strong>{item.keyword}</strong>:{" "}
                            <a href={item.url} className="text-blue-600 hover:underline">
                                {item.url}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Hn Structure et meta</h2>

            {/* Display the Title and Meta Description */}
            {result.hnStructure && (
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-2">Title Optimisé</h3>
                    <p>{result.hnStructure.title}</p>

                    <h3 className="text-2xl font-semibold mb-2 mt-4">Meta Description</h3>
                    <p>{result.hnStructure.meta_description}</p>
                </div>
            )}

            {/* Display the H1 and structured sections */}
            {result.hnStructure && result.hnStructure.structure && (
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-2">H1</h3>
                    <p>{result.hnStructure.structure.H1}</p>

                    {result.hnStructure.structure.sections.map((section, index) => (
                        <div key={index} className="mb-4">
                            {Object.keys(section).map((heading, idx) => (
                                <div key={idx} className="ml-4">
                                    <h4 className="text-xl font-semibold">{heading}</h4>
                                    {Array.isArray(section[heading]) ? (
                                        <ul className="list-disc pl-5">
                                            {section[heading].map((item, subIndex) => (
                                                <li key={subIndex}>{item}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>{section[heading]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
            <form
                className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            >
                <Label htmlFor="message" className="sr-only">
                    Message
                </Label>
                <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center p-3 pt-0">
                    <Button type="submit" size="sm" className="ml-auto gap-1.5">
                        Send Message
                        <CornerDownLeft className="size-3.5"/>
                    </Button>
                </div>
            </form>
        </div>
    )
}
