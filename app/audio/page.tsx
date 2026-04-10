"use client";

import { useLanguage } from "@/providers/LanguageProvider";
import {
  AUDIO_LISTEN_OPTIONS,
  AUDIO_SHOWS,
  type AudioShow,
} from "@/lib/data/audio-page";

function accentClass(accent: AudioShow["accent"]): string {
  switch (accent) {
    case "sport":
      return "border-l-[#1d4ed8]";
    case "culture":
      return "border-l-[#7c3aed]";
    case "regional":
      return "border-l-[#059669]";
    default:
      return "border-l-[#c70000]";
  }
}

export default function AudioPage() {
  const { language } = useLanguage();
  const isIt = language === "it";

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#c70000] mb-2">
          {isIt ? "Ascolta" : "Listen"}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {isIt ? "Audio TG Calabria" : "TG Calabria Audio"}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          {isIt
            ? "Briefing quotidiani, approfondimenti e rubriche sulla Calabria, sull’Italia e sul mondo — pensati per chi preferisce ascoltare le notizie in mobilità o a casa."
            : "Daily briefings, explainers, and shows about Calabria, Italy, and the world — built for listeners on the go or at home."}
        </p>

        <section className="mb-14" aria-labelledby="audio-shows-heading">
          <h2
            id="audio-shows-heading"
            className="text-2xl font-bold text-gray-900 border-l-4 border-[#c70000] pl-3 mb-6"
          >
            {isIt ? "Programmi e rubriche" : "Shows & rubrics"}
          </h2>
          <ul className="space-y-8 list-none p-0 m-0">
            {AUDIO_SHOWS.map((show) => (
              <li
                key={show.id}
                className={`rounded-lg border border-gray-200 bg-gray-50/80 p-5 sm:p-6 border-l-4 ${accentClass(show.accent)} shadow-sm`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isIt ? show.titleIt : show.titleEn}
                </h3>
                <p className="text-gray-600 mb-5 leading-relaxed">
                  {isIt ? show.descriptionIt : show.descriptionEn}
                </p>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {isIt ? "Ultimi episodi" : "Latest episodes"}
                </h4>
                <ul className="space-y-3 list-none p-0 m-0">
                  {show.episodes.map((ep) => (
                    <li
                      key={ep.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-t border-gray-200 first:border-t-0 first:pt-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{ep.title}</p>
                        <p className="text-sm text-gray-500">{ep.publishedLabel}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm tabular-nums text-gray-600">
                          {ep.duration}
                        </span>
                        <span className="inline-flex items-center rounded-md bg-gray-200/80 px-2.5 py-1 text-xs font-medium text-gray-600">
                          {isIt ? "In arrivo" : "Coming soon"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12" aria-labelledby="how-to-listen-heading">
          <h2
            id="how-to-listen-heading"
            className="text-2xl font-bold text-gray-900 border-l-4 border-[#c70000] pl-3 mb-6"
          >
            {isIt ? "Come ascoltare" : "How to listen"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
            {AUDIO_LISTEN_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className="rounded-lg border border-gray-200 p-5 bg-white shadow-sm"
              >
                <h3 className="font-bold text-gray-900 mb-2">
                  {isIt ? opt.titleIt : opt.titleEn}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {isIt ? opt.bodyIt : opt.bodyEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-sm text-gray-500 border-t border-gray-200 pt-8">
          {isIt
            ? "TG Calabria è un portale di notizie digitale per la Calabria e oltre. L’offerta audio sarà ampliata con streaming e podcast ufficiali; torna a trovarci per gli aggiornamenti."
            : "TG Calabria is a digital news platform for Calabria and beyond. Our audio offering will grow with official streams and podcasts — check back for updates."}
        </p>
      </div>
    </div>
  );
}
