"use client";
import {useEffect, useState} from "react";
import {SiteMapsOutput} from "@/app/api/sitemaps/route";
import {HnAndMetaStructure} from "@/app/backend/contracts/ai";
import {Playground} from "@/components/ui/blocks/playground";
import {ResultScraping} from "@/components/ui/blocks/result-scraping";
import {Toaster} from "@/components/ui/toaster";
import {useToast} from "@/hooks/use-toast"
import {LoadingSpinner} from "@/components/atoms/loader";
import WordRotate from "@/components/ui/wordRotate";
import {z} from "zod";


export type ScrapingResult = {
    response: string[];
    peopleAlsoAskQuestions: string[];
    maillage: any[];
    hnStructure: HnAndMetaStructure;
}


const ScrapePage = () => {

    const {toast} = useToast();
    const setPrincipalKeyword = (value: string) => setSearchedValue(value);
    const setWebsite = (value: string) => setWebsiteUrl(value);

    const setSiteMaps = (url: string) => setSelectedSitemap(url);

    const setKeywordsCommaSeparated = (value: string) => setKeywords(value);

    const callHandleScrape = () => handleScrape();

    const scrapeSchema = z.object({
        searchValue: z.string().min(1, "Le mot clé principal est requis."),
        keywords: z.string().min(3, "Les mots clés doivent être valide"),
        sitemapUrl: z.string().min(1, "Merci d'entrer une url valide").refine(
            (value) => {
                if (sitemaps.multipleSitemaps) {
                    return sitemaps.sitemap.includes(value);
                } else {
                    return true;
                }
            },
            {
                message: "Sélectionnez un sitemap valide.",
            }
        ),
    });

    const [searchedValue, setSearchedValue] = useState("");
    const [keywords, setKeywords] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [result, setResult] = useState<ScrapingResult>({
        response: [],
        peopleAlsoAskQuestions: [],
        maillage: [],
        hnStructure: {
            title: "",
            meta_description: "",
            structure: {
                H1: "",
                sections: []
            }
        }
    })
    const [loading, setLoading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [loadingSitemap, setLoadingSitemap] = useState(false);
    const [sitemaps, setSitemaps] = useState<SiteMapsOutput>({
        multipleSitemaps: false,
        sitemap: []
    });
    const [selectedSitemap, setSelectedSitemap] = useState("");

    const checkSiteMaps = async (url: string) => {
        if (url !== "") {
            try {
                setLoadingSitemap(true);
                const response = await fetch(`/api/sitemaps`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        websiteUrl: url,
                    }),
                });
                const data = await response.json();
                setSitemaps(data);
                if (data.multipleSitemaps) {
                    toast({
                        className: "bg-secondary text-white",
                        title: "Plusieurs sitemaps ont été trouvés",
                        description: "Merci de choisir un sitemap pour continuer",
                    });
                } else {
                    setSelectedSitemap(data.sitemap[0]);
                }
                setLoadingSitemap(false);
            } catch (error) {
                setLoadingSitemap(false);
                toast({
                    className: "bg-red-500 text-white",
                    title: "Erreur lors de la recherche du sitemap",
                    description: "Merci de vérifier l'url du site",
                });
                setWebsiteUrl("");
                console.error("Error:", error);
            }
        }
    };

    const handleScrape = async () => {
        const command = {
            searchValue: searchedValue,
            keywords: keywords,
            sitemapUrl: selectedSitemap,
        }
        const validationResult = scrapeSchema.safeParse(command);

        if (!validationResult.success) {
            validationResult.error.errors.forEach((error) => {
                toast({
                    className: "bg-red-500 text-white",
                    title: "Erreur lors de la validation",
                    description: error.message,
                });
            })
            return;
        }

        setIsFinished(false);
        setLoading(true);
        try {
            const response = await fetch(`/api/scrape`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...command,
                    keywords: [searchedValue, ...command.keywords.split(",").map((keyword) => keyword.trim())],
                }),
            });
            const data = await response.json();
            setResult({
                response: data.answersGoogleSearch.answers || [],
                peopleAlsoAskQuestions: data.answersGoogleSearch.questions || [],
                maillage: data.aiAnswer || [],
                hnStructure: data.hnStructure
            });
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsFinished(true);
            setLoading(false);
        }
    };


    return (
        <>
            <Playground
                loadingSitemap={loadingSitemap}
                setSearchedValue={setPrincipalKeyword}
                setWebsite={setWebsite}
                checkSiteMaps={checkSiteMaps}
                sitemaps={sitemaps}
                setSiteMaps={setSiteMaps}
                setKeywordsCommaSeparated={setKeywordsCommaSeparated}
                callHandleScrape={callHandleScrape}
                loading={loading}
            >

                {isFinished ? (
                        <>
                            <ResultScraping
                                result={result}
                                searchedValue={searchedValue}
                            />
                        </>
                    )
                    :
                    loading && <div className="flex flex-col justify-center h-full gap-y-16">
                        <LoadingSpinner/>
                        <div className="mx-auto text-center">
                            <WordRotate words={[
                                "Google Dance rendait les positions très instables.",
                                "Le premier backlink pointait vers le site du CERN.",
                                "Google s’appelait initialement 'Backrub' pour analyser les liens.",
                                "Matt Cutts traquait activement le spam SEO chez Google.",
                                "Yahoo! référençait manuellement les sites web au départ.",
                                "Les premiers moteurs de recherche ignoraient totalement les backlinks.",
                                "Keyword stuffing dominait les pratiques SEO dans les années 90.",
                                "Panda a réduit la visibilité des fermes de contenu.",
                                "Penguin pénalisait les liens artificiels massivement achetés.",
                                "Les recherches vocales transforment lentement le SEO aujourd'hui."
                            ]}
                                        duration={3500}
                            />
                        </div>

                    </div>
                }

            </Playground>
            <Toaster

            />
        </>
    );
};

export default ScrapePage;
