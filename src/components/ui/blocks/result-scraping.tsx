"use client"
import {ScrapingResult} from "@/app/scrape-refund/page";
import Link from "next/link";

export function ResultScraping({result, searchedValue}: { result: ScrapingResult, searchedValue: string }) {

    return (
        <div className="w-full md:w-fit mt-4 flex flex-col md:gap-8">
            <div>
                <h3 className="text-2xl font-semibold mb-2">
                    Résultats de la SERP pour le mot-clé{" "}
                    <span className="text-primary">{searchedValue}</span>
                </h3>
                <ul className="list-decimal pl-5 space-y-2">
                    {result?.response?.length > 0 ? (
                        result.response.map((item: string, index: number) => (
                            <li key={index} className="break-words">
                                <Link href={item} className="text-blue-600 hover:underline">
                                    {item}
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li>Aucun résultat trouvé</li>
                    )}
                </ul>
            </div>

            <div>
                <h3 className="text-2xl font-semibold mb-2">Questions fréquentes</h3>
                <ul className="list-disc pl-5 space-y-2">
                    {result?.peopleAlsoAskQuestions?.length > 0 ? (
                        result.peopleAlsoAskQuestions.map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                        ))
                    ) : (
                        <li>Aucune question trouvée</li>
                    )}
                </ul>
            </div>

            <div>
                <h3 className="text-2xl font-semibold mb-2">Suggestion de maillage interne</h3>
                <ul className="list-disc pl-5 space-y-2">
                    {result?.maillage?.length > 0 ? (
                        result.maillage.map((item: any, index: number) => (
                            <li key={index}>
                                <strong>{item.keyword}</strong>:{" "}
                                <a href={item.url} className="text-blue-600 hover:underline">
                                    {item.url}
                                </a>
                            </li>
                        ))
                    ) : (
                        <li>Aucune suggestion de maillage trouvée</li>
                    )}
                </ul>
            </div>

            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Hn Structure et meta</h2>

            {result?.hnStructure && (
                <div className="flex flex-col gap-y-3">
                    <h3 className="text-2xl font-semibold">Title Optimisé</h3>
                    <p>{result.hnStructure.title || "Pas de titre optimisé"}</p>

                    <h3 className="text-2xl font-semibold">Meta Description</h3>
                    <p>{result.hnStructure.meta_description || "Pas de meta description"}</p>
                </div>
            )}

            {result?.hnStructure?.structure && (
                <div className="flex flex-col gap-y-3">
                    <h3 className="text-2xl font-semibold">H1</h3>
                    <p>{result.hnStructure.structure.H1 || "Pas de H1"}</p>
                    {result.hnStructure.structure.sections.length > 0 ? (
                        result.hnStructure.structure.sections.map((section, index) => (
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
                        ))
                    ) : (
                        <p>Pas de sections structurées trouvées</p>
                    )}
                </div>
            )}
        </div>
    )
}
