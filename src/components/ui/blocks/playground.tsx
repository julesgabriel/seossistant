import {ReactNode} from "react";
import {SiteMapsOutput} from "@/app/api/sitemaps/route";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {LoadingSpinner} from "@/components/atoms/loader";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";

export function Playground({
                               children,
                               loadingSitemap,
                               setSearchedValue,
                               setWebsite,
                               checkSiteMaps,
                               sitemaps,
                               setSiteMaps,
                               setKeywordsCommaSeparated,
                               callHandleScrape,
                               loading,
                           }: {
    children: ReactNode;
    loadingSitemap: boolean;
    setSearchedValue: (e: string) => void;
    setWebsite: (e: string) => void;
    checkSiteMaps: (url: string) => Promise<void>;
    sitemaps: SiteMapsOutput;
    setSiteMaps: (url: string) => void;
    setKeywordsCommaSeparated: (e: string) => void;
    callHandleScrape: () => void;
    loading: boolean;
}) {
    return (
        <div className="h-screen w-full pl-4 md:pl-[53px]">
            <div className="flex flex-col">
                <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
                    <h1 className="text-xl font-semibold">Playground</h1>
                </header>

                <main className="flex-1 gap-4 p-4 md:p-4 grid md:grid md:grid-cols-2 lg:grid-cols-3">
                    <div className="relative w-full md:w-fit flex-col items-start gap-8 md:flex md:static">
                        <form className="grid w-full gap-6">
                            <fieldset className="grid gap-6 rounded-lg border p-4 mt-2">
                                <legend className="-ml-1 px-1 text-sm font-medium">Settings</legend>

                                <div className="grid gap-3">
                                    <Label htmlFor="principal-keyword">Mot clé principal</Label>
                                    <Input
                                        id="principal-keyword"
                                        type="text"
                                        placeholder="Entrez votre mot clé principal"
                                        onChange={(e) => setSearchedValue(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="website-url">Url du site</Label>
                                    <Input
                                        id="website-url"
                                        type="text"
                                        placeholder="Entrez l'url de votre site"
                                        onChange={(e) => setWebsite(e.target.value)}
                                        onBlur={(e) => checkSiteMaps(e.target.value)}
                                    />
                                    {loadingSitemap && (
                                        <div>
                                            <LoadingSpinner/>
                                            <span className="text-sm mt-2">
                                                Nous vérifions la présence de sitemaps sur votre site web
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {sitemaps.multipleSitemaps && (
                                    <div className="grid gap-3">
                                        <Label htmlFor="sitemap">Sitemap</Label>
                                        <Select onValueChange={(value) => setSiteMaps(value)}>
                                            <SelectTrigger id="sitemap">
                                                <SelectValue placeholder="Selectionnez le sitemap souhaité"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sitemaps.sitemap.map((url, index) => (
                                                    <SelectItem key={index} value={url}>
                                                        {url}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="grid gap-3">
                                    <Label htmlFor="keywords">Mots clés</Label>
                                    <span className="text-sm text-neutral-500">
                                        {"Vos mots clés doivent être séparés d'une virgule"}
                                    </span>
                                    <Input
                                        id="keywords"
                                        type="text"
                                        placeholder="Entrez vos mots clés"
                                        onChange={(e) => setKeywordsCommaSeparated(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Button
                                        type="button"
                                        className="bg-primary hover:bg-secondary"
                                        disabled={loading}
                                        onClick={() => callHandleScrape()}
                                    >
                                        {loading ? "Merci de patienter..." : "Lancer la génération du brief"}
                                    </Button>
                                </div>
                            </fieldset>
                        </form>
                    </div>

                    <div
                        className="relative flex flex-col rounded-xl bg-muted/50 p-4 md:p-0 lg:col-span-2 md:static md:min-h-[50vh] overflow-auto md:overflow-hidden h-full md:w-auto md:h-auto">

                        <div className="mt-3">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
