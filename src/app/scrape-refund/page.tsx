"use client";
import {useState} from "react";
import Link from "next/link";
import {SiteMapsOutput} from "@/app/api/sitemaps/route";
import {HnAndMetaStructure} from "@/app/backend/contracts/ai";
import {Playground} from "@/components/ui/blocks/playground";
import {ResultScraping} from "@/components/ui/blocks/result-scraping";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {CornerDownLeft} from "lucide-react";

export type ScrapingResult = {
    response: string[];
    peopleAlsoAskQuestions: string[];
    maillage: any[];
    hnStructure: HnAndMetaStructure;
}

const ScrapePage = () => {
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
            setSelectedSitemap(data.sitemap[0]);
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
            setResult({
                response: data.answersGoogleSearch.answers || [],
                peopleAlsoAskQuestions: data.answersGoogleSearch.questions || [],
                maillage: data.aiAnswer || [],
                hnStructure: data.hnStructure as HnAndMetaStructure
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
            <Playground>

                {isFinished && (
                    <>
                        <ResultScraping
                            searchedValue={searchedValue}
                            hnStructure={result.hnStructure} maillage={result.maillage} response={result.response}
                            peopleAlsoAskQuestions={result.peopleAlsoAskQuestions}/>
                    </>
                )}

            </Playground>
        </>
    );
};

export default ScrapePage;
