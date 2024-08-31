import {
    Bird,
    Rabbit,
    Turtle,
    Settings
} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function Playground(children: React.ReactNode) {
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
                                {/**
                                 <div className="grid gap-3">
                                 <Label htmlFor="model">Model</Label>
                                 <Select>
                                 <SelectTrigger id="model">
                                 <SelectValue placeholder="Select a model" />
                                 </SelectTrigger>
                                 <SelectContent>
                                 </SelectContent>
                                 </Select>
                                 </div>
                                 **/
                                }
                                <div className="grid gap-3">
                                    <Label htmlFor="principal-keyword">Mot clé principal</Label>
                                    <Input id="principal-keyword" type="text"
                                           placeholder="Entrez votre mot clé principal"/>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="website-url">Url du site</Label>
                                    <Input id="website-url" type="text" placeholder="Entrez l'url de votre site"/>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="keywords">Mots clés</Label>
                                    <Input id="keywords" type="text" placeholder="Entrez vos mots clés"/>
                                    <span className="px-1 text-sm text-neutral-500">Vos mots clés doivent être séparés d'une virgule entre eux</span>
                                </div>
                            </fieldset>
                        </form>

                    </div>

                    <div
                        className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
                        <Badge variant="outline" className="absolute right-3 top-3">
                            Output
                        </Badge>
                        <children/>
                    </div>
                </main>
            </div>
        </div>
    );
}
