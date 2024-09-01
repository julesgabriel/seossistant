"use client";
import {useEffect, useState} from "react";
import Link from "next/link";
import {SiteMapsOutput} from "@/app/api/sitemaps/route";
import {HnAndMetaStructure} from "@/app/backend/contracts/ai";
import {Playground} from "@/components/ui/blocks/playground";
import {ResultScraping} from "@/components/ui/blocks/result-scraping";

export type ScrapingResult = {
    response: string[];
    peopleAlsoAskQuestions: string[];
    maillage: any[];
    hnStructure: HnAndMetaStructure;
}

const ScrapePage = () => {
    const setPrincipalKeyword = (value: string) => setSearchedValue(value);
    const setWebsite = (value: string) => setWebsiteUrl(value);

    const setSiteMaps = (url: string) => setSelectedSitemap(url);

    const setKeywordsCommaSeparated = (value: string) => setKeywords(value);

    const callHandleScrape = () => handleScrape();

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
            setLoadingSitemap(false);
        } catch (error) {
            setLoadingSitemap(false);
            console.error("Error:", error);
        }
    };

    const handleScrape = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/scrape`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    searchValue: searchedValue,
                    keywords: [searchedValue, ...keywords.split(",")],
                    sitemapUrl: selectedSitemap,
                }),
            });
            const data = await response.json();
            console.log('DATA', data)
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

    useEffect(() => {
        console.log('RESULT', result)
    }, [result])

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
                {isFinished && (
                    <>
                        <ResultScraping
                            result={result}
                            searchedValue={searchedValue}
                        />
                    </>
                )}

            </Playground>
        </>
    );
};

export default ScrapePage;
