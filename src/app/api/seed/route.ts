import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const sampleMarkets = [
  // Politics
  {
    title: "Vil Arbeiderpartiet vinne stortingsvalget 2029?",
    description:
      "Markedet avgjores basert pa om Arbeiderpartiet far flest stemmer i stortingsvalget 2029.",
    category: "politics",
    yesPrice: 0.35,
    liquidity: 1000,
    closeDate: new Date("2029-09-01"),
  },
  {
    title: "Vil Hoyre danne regjering etter neste valg?",
    description:
      "Avgjores om Hoyre leder en regjeringskoalisjon etter stortingsvalget 2029.",
    category: "politics",
    yesPrice: 0.52,
    liquidity: 1000,
    closeDate: new Date("2029-10-01"),
  },
  {
    title: "Vil Norge soke EU-medlemskap innen 2030?",
    description:
      "Avgjores om den norske regjeringen formelt soker om EU-medlemskap for 1. januar 2030.",
    category: "politics",
    yesPrice: 0.05,
    liquidity: 800,
    closeDate: new Date("2030-01-01"),
  },

  // Energy
  {
    title: "Vil oljeprisen overstige 100 USD per fat i 2026?",
    description:
      "Avgjores om Brent crude oljeprisen nar over 100 USD per fat nar som helst i 2026.",
    category: "energy",
    yesPrice: 0.3,
    liquidity: 1200,
    closeDate: new Date("2026-12-31"),
  },
  {
    title: "Vil Equinor oke utbytte i 2026?",
    description:
      "Avgjores om Equinor annonserer et hoyre utbytte per aksje i 2026 sammenlignet med 2025.",
    category: "energy",
    yesPrice: 0.45,
    liquidity: 900,
    closeDate: new Date("2026-12-31"),
  },
  {
    title: "Vil Norge apne nye oljefelt i Barentshavet i 2026?",
    description:
      "Avgjores basert pa om norske myndigheter godkjenner nye oljefelt i Barentshavet i 2026.",
    category: "energy",
    yesPrice: 0.4,
    liquidity: 1000,
    closeDate: new Date("2026-12-31"),
  },

  // Sports
  {
    title: "Vil Erling Haaland score 30+ mal i Premier League 2025/26?",
    description:
      "Avgjores om Erling Braut Haaland scorer 30 eller flere mal i Premier League-sesongen 2025/26.",
    category: "sports",
    yesPrice: 0.42,
    liquidity: 1100,
    closeDate: new Date("2026-05-25"),
  },
  {
    title: "Vil Bodo/Glimt vinne Eliteserien 2026?",
    description:
      "Avgjores om FK Bodo/Glimt vinner Eliteserien i fotball-sesongen 2026.",
    category: "sports",
    yesPrice: 0.28,
    liquidity: 800,
    closeDate: new Date("2026-12-01"),
  },
  {
    title: "Vil Norge kvalifisere seg til VM 2026?",
    description:
      "Avgjores om det norske herrelandslaget kvalifiserer seg til FIFA VM 2026 i USA, Canada og Mexico.",
    category: "sports",
    yesPrice: 0.55,
    liquidity: 1500,
    closeDate: new Date("2026-06-01"),
  },

  // Weather
  {
    title: "Vil sommeren 2026 bli den varmeste noensinne i Norge?",
    description:
      "Avgjores basert pa om gjennomsnittstemperaturen juni-august 2026 setter ny norsk rekord.",
    category: "weather",
    yesPrice: 0.18,
    liquidity: 700,
    closeDate: new Date("2026-09-01"),
  },
  {
    title: "Vil det komme mer enn 2 meter sno i Tromso vinteren 2026/27?",
    description:
      "Avgjores basert pa offisielle malinger fra Meteorologisk institutt.",
    category: "weather",
    yesPrice: 0.35,
    liquidity: 600,
    closeDate: new Date("2027-03-31"),
  },

  // Culture
  {
    title: "Vil en norsk film vinne Oscar for beste internasjonale film?",
    description:
      "Avgjores om en norsk film vinner kategorien Beste internasjonale film ved Oscar-utdelingen 2027.",
    category: "culture",
    yesPrice: 0.08,
    liquidity: 600,
    closeDate: new Date("2027-03-01"),
  },
  {
    title: "Vil Norge vinne Eurovision Song Contest 2027?",
    description:
      "Avgjores om Norges bidrag vinner Eurovision Song Contest 2027.",
    category: "culture",
    yesPrice: 0.06,
    liquidity: 800,
    closeDate: new Date("2027-05-15"),
  },

  // Economy
  {
    title: "Vil Norges Bank heve renten i 2026?",
    description:
      "Avgjores om Norges Bank oker styringsrenten minst en gang i lopet av 2026.",
    category: "economy",
    yesPrice: 0.25,
    liquidity: 1300,
    closeDate: new Date("2026-12-31"),
  },
  {
    title: "Vil kronen styrke seg mot euro i 2026?",
    description:
      "Avgjores om NOK/EUR-kursen er lavere 31. desember 2026 enn 1. januar 2026.",
    category: "economy",
    yesPrice: 0.38,
    liquidity: 1000,
    closeDate: new Date("2026-12-31"),
  },
  {
    title: "Vil boligprisene i Oslo falle mer enn 5% i 2026?",
    description:
      "Avgjores basert pa SSBs boligprisindeks for Oslo fra januar til desember 2026.",
    category: "economy",
    yesPrice: 0.2,
    liquidity: 1100,
    closeDate: new Date("2027-01-15"),
  },
];

export async function GET() {
  // Check if markets already exist
  const existingCount = await prisma.market.count();
  if (existingCount > 0) {
    return NextResponse.json({
      message: `Database already has ${existingCount} markets. Delete them first to re-seed.`,
      count: existingCount,
    });
  }

  // Create demo user
  await prisma.user.upsert({
    where: { id: "demo-user" },
    update: {},
    create: {
      id: "demo-user",
      username: "demo",
      balance: 10000,
    },
  });

  // Create markets with some simulated volume
  for (const market of sampleMarkets) {
    await prisma.market.create({
      data: {
        ...market,
        volume: Math.round(Math.random() * 5000 + 500),
      },
    });
  }

  return NextResponse.json({
    message: `Seeded ${sampleMarkets.length} Norwegian prediction markets.`,
    count: sampleMarkets.length,
  });
}
