import nyraPortrait from "@/assets/nyra-portrait.jpg";
import kairoPortrait from "@/assets/kairo-portrait.jpg";
import solenePortrait from "@/assets/solene-portrait.jpg";

export const creators = [
  {
    rank: 1,
    name: "NYRA",
    handle: "@nyra.exe",
    symbol: "NYRA",
    niche: "Future fashion",
    image: nyraPortrait,
    marketCap: "$1.84M",
    volume: "$312K",
    treasury: "$48.2K",
    change: "+28.4%",
    accent: "lime",
  },
  {
    rank: 2,
    name: "KAIRO",
    handle: "@kairo.wav",
    symbol: "KAIRO",
    niche: "Music culture",
    image: kairoPortrait,
    marketCap: "$986K",
    volume: "$184K",
    treasury: "$31.7K",
    change: "+16.9%",
    accent: "cyan",
  },
  {
    rank: 3,
    name: "SOLENE",
    handle: "@solene.studio",
    symbol: "SOL",
    niche: "Beauty editorial",
    image: solenePortrait,
    marketCap: "$724K",
    volume: "$96K",
    treasury: "$22.4K",
    change: "+11.2%",
    accent: "coral",
  },
] as const;

export const chartPoints = [18, 23, 20, 31, 27, 38, 34, 49, 44, 58, 55, 71, 67, 84, 78, 92];