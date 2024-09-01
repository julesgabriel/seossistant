import {Badge} from "@/components/ui/badge";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ReactNode} from "react";
import {LoadingSpinner} from "@/components/atoms/loader";
import {SiteMapsOutput} from "@/app/api/sitemaps/route";
import {Button} from "@/components/ui/button";

export function Playground({
                               children, // Children should be passed as part of props
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
        <div className="grid h-screen w-full pl-4 md:pl-[53px]">
            <div className="flex flex-col">
                <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
                    <h1 className="text-xl font-semibold">Playground</h1>
                </header>

                <main className="grid flex-1 gap-4 p-4 overflow-auto md:grid-cols-2 lg:grid-cols-3">
                    <div className="relative hidden flex-col items-start gap-8 md:flex">
                        <form className="grid w-full gap-6">
                            <fieldset className="grid gap-6 rounded-lg border p-4">
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
                                        <div className="w-1/3">
                                            <LoadingSpinner/>
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
                                    <Input id="keywords" type="text" placeholder="Entrez vos mots clés"
                                           onChange={e => setKeywordsCommaSeparated(e.target.value)}/><span
                                    className="px-1 text-sm text-neutral-500">
                                    Vos mots clés doivent être séparés d'une virgule entre eux
                                </span>
                                </div>
                                <div className="grid gap-3">
                                    <Button
                                        type={"button"}
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
                        className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
                        <Badge variant="outline" className="absolute right-3 top-3">
                            Output
                        </Badge>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
