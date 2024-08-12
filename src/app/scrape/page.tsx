"use client";
import {useState} from 'react';
import Link from "next/link";

const ScrapePage = () => {
    const [keyword, setKeyword] = useState('');
    const [keywords, setKeywords] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [result, setResult] = useState<{
        response: string[],
        peopleAlsoAskQuestions: string[],
        maillage: { keyword: string, url: string }[]
    }>({
        response: [
            "lien 1",
            "lien 2",
            "lien 3",
            "lien 4",
            "lien 5",
            "lien 6",
            "lien 7",
            "lien 8",
            "lien 9",
            "lien 10",
        ],
        peopleAlsoAskQuestions: [
            "questions 1",
            "questions 2",
            "questions 3",
            "questions 4",
            "questions 5",
            "questions 6",
            "questions 7",
            "questions 8",
            "questions 9",
            "questions 10",
        ],
        maillage: [
            {keyword: "keyword 1", url: "url 1"},
            {keyword: "keyword 2", url: "url 2"},
            {keyword: "keyword 3", url: "url 3"},
            {keyword: "keyword 4", url: "url 4"},
            {keyword: "keyword 5", url: "url 5"},
            {keyword: "keyword 6", url: "url 6"},
            {keyword: "keyword 7", url: "url 7"},
            {keyword: "keyword 8", url: "url 8"},
            {keyword: "keyword 9", url: "url 9"},
            {keyword: "keyword 10", url: "url 10"},
        ]
    });
    const [loading, setLoading] = useState(false);

    const [isFinished, setIsFinished] = useState(false);

    const handleScrape = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/scrape`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchValue: keyword,
                    keywords: keywords.split(','),
                    websiteUrl: websiteUrl
                }),
            });
            const data = await response.json();
            setResult((prevState) => ({
                ...prevState,
                response: data.response,
                peopleAlsoAskQuestions: data.peopleAlsoAskQuestions ? data.peopleAlsoAskQuestions : [],
                maillage: data.computedSiteMap
            }));
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsFinished(true);
            setLoading(false);
        }
    };

    return (
        <div className="py-12">
            <div className="mt-4 p-4 flex gap-y-4 w-11/12 mx-auto">
                <div className="w-1/2 top-0">
                    <h2 className="text-3xl font-bold mb-6">Génération du brief</h2>
                    <div className="flex flex-col gap-y-3">
                        <input
                            className="input w-full lg:w-3/5 mr-0 lg:mr-6 input-bordered mb-2 lg:mb-0"
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Enter keyword"
                            type="text"
                            value={keyword}
                        />

                        <input
                            className="input w-full lg:w-3/5 mr-0 lg:mr-6 input-bordered mb-2 lg:mb-0"
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="Entrez l'url de votre site"
                            type="text"
                            value={websiteUrl}
                        />
                        <textarea
                            className="input w-full lg:w-3/5 mr-0 lg:mr-6 input-bordered mb-2 lg:mb-0"
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="Entrez vos mots clés séparer par une virgule"
                            value={keywords}
                        />

                        <button
                            className={`btn w-full lg:w-3/5 ${loading ? 'btn-disabled' : 'btn-primary'}`}
                            disabled={loading}
                            onClick={handleScrape}
                        >
                            {loading ? 'Merci de patienter...' : 'Lancer la génération du brief'}
                        </button>
                    </div>
                </div>

                <div className={`w-1/2 flex flex-col gap-y-8 ml-auto`}>
                    {isFinished && (
                        <>
                            <div className="flex flex-col gap-y-4">
                                <h2 className="text-3xl font-semibold mb-2">Résultats</h2>
                                <h3 className="text-2xl font-semibold">
                                    5 recherches les plus fréquentes pour le mot clé <span
                                    className="text-primary font-semibold">{keyword}</span>
                                </h3>
                                <ul className="list-decimal pl-5 flex flex-col gap-y-3">
                                    {result.response.map((item: string, index: number) => (
                                        <Link key={index} href={item} className="link">
                                            <li key={index} className="break-all">
                                                {item}
                                            </li>
                                        </Link>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold mb-2">Questions fréquentes</h2>
                                <ul className="list-disc pl-5 space-y-3">
                                    {result.peopleAlsoAskQuestions.map((item: string, index: number) => (
                                        <li key={index}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold mb-2">Maillage le plus optimisé</h2>
                                <ul className="list-disc pl-5 space-y-3">
                                    {result.maillage.map((item, index: number) => (
                                        <li key={index}>
                                            {item.keyword}: {item.url}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button className="btn w-full lg:w-1/3 btn-primary">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                     className="w-6 h-6">
                                    <path
                                        d="M12 5L11.2929 4.29289L12 3.58579L12.7071 4.29289L12 5ZM13 14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14L13 14ZM6.29289 9.29289L11.2929 4.29289L12.7071 5.70711L7.70711 10.7071L6.29289 9.29289ZM12.7071 4.29289L17.7071 9.29289L16.2929 10.7071L11.2929 5.70711L12.7071 4.29289ZM13 5L13 14L11 14L11 5L13 5Z"
                                        fill="#33363F"
                                    />
                                    <path d="M5 16L5 17C5 18.1046 5.89543 19 7 19L17 19C18.1046 19 19 18.1046 19 17V16"
                                          stroke="#33363F" strokeWidth="2"/>
                                </svg>
                                Exporter les données
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScrapePage;
