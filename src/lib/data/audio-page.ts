/**
 * Editorial-style audio offerings for TG Calabria (static content; replace with CMS/API later).
 */
export type AudioEpisode = {
  id: string;
  title: string;
  duration: string;
  publishedLabel: string;
};

export type AudioShow = {
  id: string;
  titleEn: string;
  titleIt: string;
  descriptionEn: string;
  descriptionIt: string;
  accent: "news" | "sport" | "culture" | "regional";
  episodes: AudioEpisode[];
};

export const AUDIO_SHOWS: AudioShow[] = [
  {
    id: "calabria-mattina",
    titleEn: "Calabria Morning",
    titleIt: "Calabria Mattina",
    descriptionEn:
      "Daily wake-up briefing: regional headlines, traffic and weather for Calabria, and the top national stories you need before the day starts.",
    descriptionIt:
      "Rassegna mattutina: titoli dalla Calabria, traffico e meteo, e i principali fatti nazionali per iniziare la giornata informati.",
    accent: "regional",
    episodes: [
      {
        id: "cm-001",
        title: "Regional digest — Cosenza, Reggio, Catanzaro",
        duration: "12:40",
        publishedLabel: "Today · 07:15",
      },
      {
        id: "cm-002",
        title: "Highways A2 / Salerno–Reggio updates",
        duration: "06:12",
        publishedLabel: "Today · 07:22",
      },
      {
        id: "cm-003",
        title: "National politics — what moved overnight",
        duration: "09:05",
        publishedLabel: "Today · 07:30",
      },
    ],
  },
  {
    id: "mondo-italia",
    titleEn: "Italy & World Report",
    titleIt: "Rapporto Italia & Mondo",
    descriptionEn:
      "Deeper context on Italy and international news: politics, diplomacy, and major events with our editors’ notes.",
    descriptionIt:
      "Approfondimenti su Italia e estero: politica, diplomazia ed eventi di rilievo con il commento della redazione.",
    accent: "news",
    episodes: [
      {
        id: "mi-001",
        title: "EU agenda and Italy’s priorities this week",
        duration: "18:22",
        publishedLabel: "Yesterday · 18:00",
      },
      {
        id: "mi-002",
        title: "Mediterranean focus — security and migration",
        duration: "21:06",
        publishedLabel: "2 days ago · 17:45",
      },
    ],
  },
  {
    id: "sport-calabria",
    titleEn: "Sport — Calabria & Serie focus",
    titleIt: "Sport — Calabria e Serie",
    descriptionEn:
      "Results, transfers, and local clubs: from Serie A highlights to amateur and youth leagues across the region.",
    descriptionIt:
      "Risultati, calciomercato e squadre locali: dalla Serie A al calcio giovanile e dilettantistico in regione.",
    accent: "sport",
    episodes: [
      {
        id: "sc-001",
        title: "Weekend round-up — scores and standings",
        duration: "14:33",
        publishedLabel: "Mon · 09:10",
      },
      {
        id: "sc-002",
        title: "Youth and provincial leagues spotlight",
        duration: "11:48",
        publishedLabel: "Sun · 20:15",
      },
    ],
  },
  {
    id: "culture-extra",
    titleEn: "Culture & Entertainment",
    titleIt: "Cultura & Spettacolo",
    descriptionEn:
      "Festivals, cinema, music, and food from Calabria and beyond — short listens for your commute.",
    descriptionIt:
      "Festival, cinema, musica e gastronomia dalla Calabria e non solo — formati brevi per gli spostamenti.",
    accent: "culture",
    episodes: [
      {
        id: "ce-001",
        title: "Weekend events across the provinces",
        duration: "08:55",
        publishedLabel: "Thu · 16:00",
      },
      {
        id: "ce-002",
        title: "Heritage minute — villages and traditions",
        duration: "05:20",
        publishedLabel: "Wed · 11:30",
      },
    ],
  },
];

export const AUDIO_LISTEN_OPTIONS = [
  {
    id: "web",
    titleEn: "On this site",
    titleIt: "Su questo sito",
    bodyEn:
      "Use the Listen link in the header on desktop and mobile. Playback is optimised for modern browsers.",
    bodyIt:
      "Usa il link Ascolta nell’intestazione su desktop e mobile. La riproduzione è ottimizzata per i browser recenti.",
  },
  {
    id: "rss",
    titleEn: "Podcast feed (coming soon)",
    titleIt: "Feed podcast (in arrivo)",
    bodyEn:
      "We are preparing an RSS feed so you can add TG Calabria audio to Apple Podcasts, Spotify, and other apps.",
    bodyIt:
      "Stiamo preparando un feed RSS per aggiungere l’audio di TG Calabria ad Apple Podcasts, Spotify e altre app.",
  },
  {
    id: "smart",
    titleEn: "Smart speakers",
    titleIt: "Assistenti vocali",
    bodyEn:
      "Voice distribution may be offered later; follow our announcements on the homepage and social channels.",
    bodyIt:
      "L’integrazione con assistenti vocali potrà essere attivata in seguito; segui gli aggiornamenti in homepage e sui social.",
  },
] as const;
