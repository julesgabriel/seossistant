import {AIService, Scraping, usecase} from "./usecase";


const siteMapResult = [
    "https://www.iroko.eu/blog/investir-dans-une-scpi-en-usufruit-e",
    "https://www.iroko.eu/blog/scpi-sans-frais-dentree",
    "https://www.iroko.eu/blog/scpi-vs-crowdfunding-comparaison-des-deux-placements",
    "https://www.iroko.eu/blog/tout-comprendre-sur-les-scpi-diversifiees",
    "https://www.iroko.eu/blog/tout-savoir-sur-la-scpi-residentielle",
    "https://www.iroko.eu/blog/scpi-verte-investissement-durable-et-rentable",
    "https://www.iroko.eu/blog/quest-ce-quune-scpi-de-rendement",
    "https://www.iroko.eu/blog/comment-iroko-est-devenue-une-societe-de-gestion",
    "https://www.iroko.eu/blog/lapres-covid-va-t-il-marquer-un-tournant-pour-les-scpi",
    "https://www.iroko.eu/blog/acheter-des-parts-de-scpi-pour-quelles-raisons",
    "https://www.iroko.eu/blog/scpi-arnaque",
    "https://www.iroko.eu/blog/scpi-logistique",
    "https://www.iroko.eu/blog/pourquoi-acheter-des-parts-de-scpi-a-credit",
    "https://www.iroko.eu/blog/comment-iroko-zen-reinvente-le-marche-des-scpi-traditionnelles",
    "https://www.iroko.eu/blog/scpi-vs-crowdfunding-comparaison-des-deux-placements",
    "https://www.iroko.eu/blog/scpi-et-inflation-quels-sont-les-risques",
    "https://www.iroko.eu/blog/linvestissement-socialement-responsable-en-scpi",
    "https://www.iroko.eu/blog/la-scpi-iroko-zen-vs-le-livret-a-quel-est-le-meilleur-produit-depargne",
    "https://www.iroko.eu/blog/5-avantages-a-investir-dans-une-scpi",
    "https://www.iroko.eu/blog/scpi-avis-est-ce-un-bon-placement"
]

const resultOfUrlsWhenArticleAreFound = [
    {
        "keyword": "SCPI Investment",
        "url": "https://www.iroko.eu/blog/investir-dans-une-scpi-en-usufruit-e"
    },
    {
        "keyword": "Real Estate Savings",
        "url": "https://www.iroko.eu/blog/scpi-sans-frais-dentree"
    },
    {
        "keyword": "Passive Income",
        "url": "https://www.iroko.eu/blog/scpi-vs-crowdfunding-comparaison-des-deux-placements"
    },
    {
        "keyword": "Real Estate Diversification",
        "url": "https://www.iroko.eu/blog/tout-comprendre-sur-les-scpi-diversifiees"
    },
    {
        "keyword": "Financial Security",
        "url": "https://www.iroko.eu/blog/scpi-sans-frais-dentree"
    },
    {
        "keyword": "Capital Growth",
        "url": "https://www.iroko.eu/blog/tout-savoir-sur-la-scpi-residentielle"
    },
    {
        "keyword": "Tax Benefits",
        "url": "https://www.iroko.eu/blog/scpi-vs-crowdfunding-comparaison-des-deux-placements"
    },
    {
        "keyword": "SCPI Performance",
        "url": "https://www.iroko.eu/blog/tout-comprendre-sur-les-scpi-diversifiees"
    },
    {
        "keyword": "Wealth Management",
        "url": "https://www.iroko.eu/blog/scpi-sans-frais-dentree"
    },
    {
        "keyword": "Long-term Investment",
        "url": "https://www.iroko.eu/blog/scpi-verte-investissement-durable-et-rentable"
    }
]

describe("Scrape Usecase", () => {
    const mockedFindUrls = jest.fn()
    const mockScrapSiteMap = jest.fn()

    const mockedScrapingGateway: jest.Mocked<Scraping> = {
        scrapSiteMap: mockScrapSiteMap
    }

    const mockedAIService: jest.Mocked<AIService> = {
        findUrlsBasedOnKeywordsProvided: mockedFindUrls
    }

    const keywords = [
        "SCPI Investment",
        "Real Estate Savings",
        "Passive Income",
        "Real Estate Diversification",
        "Financial Security",
        "Capital Growth",
        "Tax Benefits",
        "SCPI Performance",
        "Wealth Management",
        "Long-term Investment"
    ]
    it("should return the correct result", async () => {
        mockScrapSiteMap.mockResolvedValueOnce(siteMapResult)
        mockedFindUrls.mockResolvedValueOnce(resultOfUrlsWhenArticleAreFound
        )
        const result = await usecase(keywords, 'https://www.iroko.eu/', {
            scrapingService: mockedScrapingGateway,
            aiService: mockedAIService
        })
        expect(mockScrapSiteMap).toBeCalledWith(keywords, 'https://www.iroko.eu/sitemap.xml')
        expect(mockedFindUrls).toBeCalledWith(keywords, siteMapResult)
        expect(result).toEqual(resultOfUrlsWhenArticleAreFound)
    });
})