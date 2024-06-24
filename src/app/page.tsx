'use client';

import {useEffect} from "react";
import {redirect} from "next/navigation";

export default function Page(): JSX.Element {
    useEffect(() => {
        redirect("/scrape");
    })

  return (
      <main className="flex flex-col items-center justify-between min-h-screen p-24">

      </main>
  );
}
