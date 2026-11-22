import type { DemoReel, Profile, RateCard, Testimonial, VideoReel } from "./types.ts";

// Everything on the site comes from here until the Supabase CMS is connected.
// To add a demo: upload the .mp3 into /public/audio and set
// source: { kind: "file", url: "/audio/your-file.mp3" }.

export const profile: Profile = {
  name: "Loveline Loverez",
  stageName: "Loveline VO",
  brand: "Boses Filipina",
  tagline: "Your voice for every story.",
  intro:
    "Philippine-based voice-over artist for commercials, explainer videos and digital content. Warm, versatile and studio-equipped, with just the right amount of sparkle in every script.",
  about: [
    "Kumusta! I'm Loveline, the voice behind Boses Filipina. I record from my own studio in the Philippines and work with brands, agencies and producers here and overseas.",
    "Most of my work is commercials and digital ads, from fabric conditioner to milk formula to vitamins, plus narration, character voices and e-learning. I bring Filipino warmth to every read, and I care just as much about clean audio and hitting your timing to the frame.",
    "Send me a script and I'll send you a voice that feels like it was always meant to be there.",
  ],
  location: "Philippines",
  email: "hello@lovelinevo.com",
  portrait: "/images/loveline-studio.jpg",
  portraitCaption: "at work in my studio",
  stats: [
    { value: "500+", label: "projects completed" },
    { value: "4+", label: "years behind the mic" },
    { value: "500+", label: "happy clients" },
  ],
  services: [
    { title: "Commercial voice-over", body: "TV, radio, online and social ads that sound like a friend, not a sales pitch." },
    { title: "Narration", body: "Explainers, corporate videos and documentaries, clear and easy to follow." },
    { title: "Character voices", body: "Animation, games and kids' content with personality to spare." },
    { title: "E-learning", body: "Course modules and training videos that keep learners listening." },
  ],
  socials: [
    { label: "Upwork", url: "https://www.upwork.com/freelancers/lovelinevo" },
    { label: "Fiverr", url: "https://www.fiverr.com/lovelinevo" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/lovelinevo" },
    { label: "TikTok", url: "https://www.tiktok.com/@lovelinevo" },
  ],
  today: [
    { text: "Warm up", done: true },
    { text: "Read the script", done: true },
    { text: "Record", done: true },
    { text: "Send to client", done: false },
  ],
};

export const demoReels: DemoReel[] = [
  {
    slug: "commercial",
    title: "Commercial demo",
    category: "Commercial",
    blurb: "Bright, friendly reads for TV, radio and social ads.",
    source: { kind: "none" },
    isNew: true,
    featured: true,
    paper: "cream",
    order: 1,
  },
  {
    slug: "narration",
    title: "Narration demo",
    category: "Narration",
    blurb: "Explainers and corporate videos, warm and easy to follow.",
    source: { kind: "none" },
    featured: true,
    paper: "kraft",
    order: 2,
  },
  {
    slug: "character",
    title: "Character demo",
    category: "Character",
    blurb: "Playful voices for animation, games and kids' content.",
    source: { kind: "none" },
    featured: true,
    paper: "blush",
    order: 3,
  },
  {
    slug: "e-learning",
    title: "E-learning demo",
    category: "E-learning",
    blurb: "Course modules and training that keep people listening.",
    source: { kind: "none" },
    featured: true,
    paper: "butter",
    order: 4,
  },
];

export const videoReels: VideoReel[] = [
  {
    slug: "stress-tabs",
    title: "Stress Tabs",
    client: "Stress Tabs",
    label: "TV / digital ad",
    blurb: "TV and digital commercial for the Stress Tabs vitamin supplement, about stress relief for busy Filipinos.",
    duration: "0:30",
    poster: "/images/reel-stresstabs.png",
    orientation: "landscape",
    source: { kind: "drive", id: "1l2OBrG2kttJx6c-anE25VotV4kduSAOH" },
    order: 1,
  },
  {
    slug: "surf-fabcon",
    title: "Surf Fabcon",
    client: "Surf Philippines",
    label: "Digital VO ad",
    blurb: "Digital ad for Surf fabric conditioner, all about freshness and long-lasting fragrance.",
    duration: "0:06",
    poster: "/images/reel-surf.jpg",
    orientation: "landscape",
    source: { kind: "drive", id: "1NgGHifoS-jeRxT7E56C740krFW5uB5_R" },
    order: 2,
  },
  {
    slug: "bonakid",
    title: "Bonakid",
    client: "Bonakid",
    label: "Digital VO ad",
    blurb: "Digital ad for Bonakid milk formula, about children's growth, told with warmth and trust.",
    duration: "0:09",
    poster: "/images/reel-bonakid.jpg",
    orientation: "landscape",
    source: { kind: "drive", id: "1skmoTuJwCoK_zKxEf8Eboqp_bU16S8mq" },
    order: 3,
  },
];

export const rateCard: RateCard = {
  title: "Voice rate card",
  updated: "November 2026",
  includes: [
    "Recorded in my own studio",
    "Clean, edited WAV and MP3 files",
    "One round of pickups for small changes",
  ],
  terms: [
    "Rates are for the recording. Broadcast usage and buyouts are quoted per project.",
    "Script changes after recording are billed as a new session.",
    "Rush delivery is available on request.",
  ],
  rates: [
    { id: "social-ad", group: "Commercial", service: "Online / social media ad", unit: "per spot, up to 60s", pricePhp: null, priceUsd: null, order: 1 },
    { id: "broadcast-ad", group: "Commercial", service: "TV / radio broadcast", unit: "per spot, plus usage", pricePhp: null, priceUsd: null, order: 2 },
    { id: "explainer", group: "Narration", service: "Explainer & corporate video", unit: "per finished minute", pricePhp: null, priceUsd: null, order: 3 },
    { id: "elearning", group: "Narration", service: "E-learning module", unit: "per finished minute", pricePhp: null, priceUsd: null, order: 4 },
    { id: "character", group: "Character", service: "Animation & games", unit: "per hour in session", pricePhp: null, priceUsd: null, order: 5 },
    { id: "ivr", group: "Other", service: "IVR & phone prompts", unit: "per set of prompts", pricePhp: null, priceUsd: null, order: 6 },
  ],
};

export const testimonials: Testimonial[] = [
  {
    id: "agency",
    quote:
      "We worked with multiple voice artists locally and overseas but couldn't find the right fit for our project. Once we collaborated with her, everything aligned. The voice performance, sound quality, and time sync were outstanding. She was exactly what we were looking for.",
    highlights: ["Excellent voice acting", "High-quality audio", "Precise time synchronization"],
    role: "Production Team Lead, Creative Director",
    company: "International media agency",
  },
  {
    id: "studio",
    quote:
      "A true professional and incredibly easy to work with. She delivered strong results, and we genuinely appreciated the collaboration. We should be thanking her.",
    highlights: ["Easy to work with", "Strong results"],
    role: "Senior Producer, Production Manager",
    company: "Commercial production studio",
  },
];
