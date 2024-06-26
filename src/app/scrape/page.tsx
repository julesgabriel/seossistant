"use client";
import {useState} from 'react';
import Link from "next/link";

const ScrapePage = () => {
    const [keyword, setKeyword] = useState('');
    const [result, setResult] = useState({
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
        keywordsForOptimizedMeshing: [
            "mot clé 1",
            "mot clé 2",
            "mot clé 3",
            "mot clé 4",
            "mot clé 5",
            "mot clé 6",
            "mot clé 7",
            "mot clé 8",
            "mot clé 9",
            "mot clé 10",
        ],
        maillage: [
            "site:example.com",
            "site:example.com",
            "site:example.com",
            "site:example.com",
            "site:example.com",
            "site:example.com",
        ]
    });
    const [loading, setLoading] = useState(false);

    const [step, setStep] = useState(0);

    const handleScrape = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/scrape`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({searchValue: keyword}),
            });
            const data = await response.json();
            setResult((prevState) => ({
                ...prevState,
                response: data.response.filter((item: any) => item !== null),
                peopleAlsoAskQuestions: data.peopleAlsoAskQuestions ? data.peopleAlsoAskQuestions : [],
            }));
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
            setStep(1);
        }
    };

    const handleUpload = async () => {
        setLoading(true);
        try {
            console.log('Uploading file');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setStep(2);
            setTimeout(() => {
                setStep(3);
                setLoading(false);
            }, 6000);
        }
    };

    return (
        <div className="py-12">
            <ul className="steps w-full">
                <li className="step step-primary">Choix du mot clé initial</li>
                <li className={`step ${step > 0 ? 'step-primary' : ''}`}>Upload de votre champs sémantique</li>
                <li className={`step ${step > 1 ? 'step-primary' : ''}`}>Génération du maillage</li>
                <li className={`step ${step > 2 ? 'step-primary' : ''}`}>Récapitulatif et export</li>
            </ul>

            <div className="mt-4 p-4 flex flex-wrap gap-y-4 w-11/12 mx-auto">
                {step < 1 && (
                    <div className="w-full lg:w-2/5 lg:sticky top-0">
                        <h2 className="text-3xl font-bold mb-6">Choix du mot clé initial</h2>
                        <div className="flex flex-wrap">
                            <input
                                className="input w-full lg:w-2/3 mr-0 lg:mr-6 input-bordered mb-2 lg:mb-0"
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Enter keyword"
                                type="text"
                                value={keyword}
                            />
                            <button
                                className={`btn w-full lg:w-auto ${loading ? 'btn-disabled' : 'btn-primary'}`}
                                disabled={loading}
                                onClick={handleScrape}
                            >
                                {loading ? 'Scraping...' : 'Scrape'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="w-full lg:w-2/5 lg:sticky top-0">
                        <h2 className="text-3xl font-bold mb-6">Champs sémantique</h2>
                        <div className="label">
                            <span className="label-text-alt">Uploadez votre document pour optimiser le maillage</span>
                        </div>
                        <input
                            type="file"
                            className="file-input file-input-bordered file-input-primary w-full"
                            onChange={handleUpload}
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="w-full lg:w-2/5 flex flex-col justify-center items-center">
                        <h2 className="text-lg font-medium mb-6">Génération du maillage le plus optimisé</h2>
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                )}

                <div className={`flex flex-col gap-y-8 ml-auto ${step === 3 ? 'w-full' : 'w-full lg:w-3/5'}`}>
                    {step > 0 && (
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
                                    {result.maillage.map((item: string, index: number) => (
                                        <li key={index}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold mb-2">Mots clés</h2>
                                <ul className="list-disc pl-5 space-y-3">
                                    {result.keywordsForOptimizedMeshing.map((item: string, index: number) => (
                                        <li key={index}>
                                            {item}
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
