"use client";
import {useState} from "react";
import Link from "next/link";
import {SiteMapsOutput} from "@/app/api/sitemaps/route";
import {HnAndMetaStructure} from "@/app/backend/contracts/ai";

const ScrapePage = () => {
    const [searchedValue, setSearchedValue] = useState("");
    const [keywords, setKeywords] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [result, setResult] = useState({
        response: [],
        peopleAlsoAskQuestions: [],
        maillage: [],
        hnStructure: {} as HnAndMetaStructure
    });
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
                    keywords: [searchedValue, ...keywords.split(",") ],
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
        <div className="py-12">
            <div className="mt-4 p-4 w-11/12 mx-auto bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Génération du brief</h2>
                <div className="flex flex-col gap-y-6">
                    <div>
                        <label htmlFor="keyword" className="block text-lg font-medium text-gray-700 mb-2">
                            Mot clé principal
                        </label>
                        <input
                            id="keyword"
                            className="input w-full lg:w-3/5 input-bordered"
                            onChange={(e) => setSearchedValue(e.target.value)}
                            placeholder="Entrez le mot clé"
                            type="text"
                            value={searchedValue}
                        />
                    </div>

                    <div>
                        <label htmlFor="websiteUrl" className="block text-lg font-medium text-gray-700 mb-2">
                            URL du site web
                        </label>
                        <input
                            id="websiteUrl"
                            className="input w-full lg:w-3/5 input-bordered"
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            onBlur={(e) => checkSiteMaps(e.target.value)}
                            placeholder="Entrez l'URL de votre site"
                            type="text"
                            value={websiteUrl}
                        />
                        {loadingSitemap && <p className="text-sm text-gray-500 mt-2">Chargement des sitemaps...</p>}
                    </div>

                    {sitemaps.multipleSitemaps && websiteUrl !== '' && (
                        <div>
                            <label htmlFor="sitemap" className="block text-lg font-medium text-gray-700 mb-2">
                                Choisissez votre sitemap
                            </label>
                            <p className="text-sm text-gray-500 mb-2">
                                Nous avons trouvé plusieurs sitemaps. Veuillez en sélectionner un pour des résultats
                                optimisés.
                            </p>
                            <select id="sitemap" className="input w-full lg:w-3/5 input-bordered"
                                    onChange={(e) => setSelectedSitemap(e.target.value)}>
                                {sitemaps.sitemap.map((item, index) => (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label htmlFor="keywords" className="block text-lg font-medium text-gray-700 mb-2">
                            Mots clés supplémentaires
                        </label>
                        <textarea
                            id="keywords"
                            className="input w-full lg:w-3/5 input-bordered"
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="Entrez vos mots clés séparés par une virgule"
                            value={keywords}
                        />
                    </div>

                    <div>
                        <button
                            className={`btn w-full lg:w-3/5 ${loading ? "btn-disabled" : "btn-primary"}`}
                            disabled={loading}
                            onClick={handleScrape}
                        >
                            {loading ? "Merci de patienter..." : "Lancer la génération du brief"}
                        </button>
                    </div>
                </div>

                {isFinished && (
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




                        {/*
                        <button className="btn w-full lg:w-1/3 btn-primary">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 mr-2"
                            >
                                <path
                                    d="M12 5L11.2929 4.29289L12 3.58579L12.7071 4.29289L12 5ZM13 14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14L13 14ZM6.29289 9.29289L11.2929 4.29289L12.7071 5.70711L7.70711 10.7071L6.29289 9.29289ZM12.7071 4.29289L17.7071 9.29289L16.2929 10.7071L11.2929 5.70711L12.7071 4.29289ZM13 5L13 14L11 14L11 5L13 5Z"
                                    fill="#fff"
                                />
                                <path
                                    d="M5 16L5 17C5 18.1046 5.89543 19 7 19L17 19C18.1046 19 19 18.1046 19 17V16"
                                    stroke="#fff"
                                    strokeWidth="2"
                                />
                            </svg>
                            Exporter les données
                        </button>
                        */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScrapePage;
