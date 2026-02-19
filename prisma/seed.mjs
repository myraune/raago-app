import { createClient } from "@libsql/client";
import { randomUUID } from "crypto";

const client = createClient({ url: "file:prisma/dev.db" });

const sampleMarkets = [
  {
    title: "Vil Arbeiderpartiet vinne stortingsvalget 2029?",
    description: "Markedet avgjores basert pa om Arbeiderpartiet far flest stemmer i stortingsvalget 2029.",
    category: "politics",
    yesPrice: 0.35,
    liquidity: 1000,
    closeDate: "2029-09-01T00:00:00.000Z",
  },
  {
    title: "Vil Hoyre danne regjering etter neste valg?",
    description: "Avgjores om Hoyre leder en regjeringskoalisjon etter stortingsvalget 2029.",
    category: "politics",
    yesPrice: 0.52,
    liquidity: 1000,
    closeDate: "2029-10-01T00:00:00.000Z",
  },
  {
    title: "Vil Norge soke EU-medlemskap innen 2030?",
    description: "Avgjores om den norske regjeringen formelt soker om EU-medlemskap for 1. januar 2030.",
    category: "politics",
    yesPrice: 0.05,
    liquidity: 800,
    closeDate: "2030-01-01T00:00:00.000Z",
  },
  {
    title: "Vil oljeprisen overstige 100 USD per fat i 2026?",
    description: "Avgjores om Brent crude oljeprisen nar over 100 USD per fat nar som helst i 2026.",
    category: "energy",
    yesPrice: 0.3,
    liquidity: 1200,
    closeDate: "2026-12-31T00:00:00.000Z",
  },
  {
    title: "Vil Equinor oke utbytte i 2026?",
    description: "Avgjores om Equinor annonserer et hoyre utbytte per aksje i 2026 sammenlignet med 2025.",
    category: "energy",
    yesPrice: 0.45,
    liquidity: 900,
    closeDate: "2026-12-31T00:00:00.000Z",
  },
  {
    title: "Vil Norge apne nye oljefelt i Barentshavet i 2026?",
    description: "Avgjores basert pa om norske myndigheter godkjenner nye oljefelt i Barentshavet i 2026.",
    category: "energy",
    yesPrice: 0.4,
    liquidity: 1000,
    closeDate: "2026-12-31T00:00:00.000Z",
  },
  {
    title: "Vil Erling Haaland score 30+ mal i Premier League 2025/26?",
    description: "Avgjores om Erling Braut Haaland scorer 30 eller flere mal i Premier League-sesongen 2025/26.",
    category: "sports",
    yesPrice: 0.42,
    liquidity: 1100,
    closeDate: "2026-05-25T00:00:00.000Z",
  },
  {
    title: "Vil Bodo/Glimt vinne Eliteserien 2026?",
    description: "Avgjores om FK Bodo/Glimt vinner Eliteserien i fotball-sesongen 2026.",
    category: "sports",
    yesPrice: 0.28,
    liquidity: 800,
    closeDate: "2026-12-01T00:00:00.000Z",
  },
  {
    title: "Vil Norge kvalifisere seg til VM 2026?",
    description: "Avgjores om det norske herrelandslaget kvalifiserer seg til FIFA VM 2026.",
    category: "sports",
    yesPrice: 0.55,
    liquidity: 1500,
    closeDate: "2026-06-01T00:00:00.000Z",
  },
  {
    title: "Vil sommeren 2026 bli den varmeste noensinne i Norge?",
    description: "Avgjores basert pa om gjennomsnittstemperaturen juni-august 2026 setter ny norsk rekord.",
    category: "weather",
    yesPrice: 0.18,
    liquidity: 700,
    closeDate: "2026-09-01T00:00:00.000Z",
  },
  {
    title: "Vil det komme mer enn 2 meter sno i Tromso vinteren 2026/27?",
    description: "Avgjores basert pa offisielle malinger fra Meteorologisk institutt.",
    category: "weather",
    yesPrice: 0.35,
    liquidity: 600,
    closeDate: "2027-03-31T00:00:00.000Z",
  },
  {
    title: "Vil en norsk film vinne Oscar for beste internasjonale film?",
    description: "Avgjores om en norsk film vinner kategorien Beste internasjonale film ved Oscar-utdelingen 2027.",
    category: "culture",
    yesPrice: 0.08,
    liquidity: 600,
    closeDate: "2027-03-01T00:00:00.000Z",
  },
  {
    title: "Vil Norge vinne Eurovision Song Contest 2027?",
    description: "Avgjores om Norges bidrag vinner Eurovision Song Contest 2027.",
    category: "culture",
    yesPrice: 0.06,
    liquidity: 800,
    closeDate: "2027-05-15T00:00:00.000Z",
  },
  {
    title: "Vil Norges Bank heve renten i 2026?",
    description: "Avgjores om Norges Bank oker styringsrenten minst en gang i lopet av 2026.",
    category: "economy",
    yesPrice: 0.25,
    liquidity: 1300,
    closeDate: "2026-12-31T00:00:00.000Z",
  },
  {
    title: "Vil kronen styrke seg mot euro i 2026?",
    description: "Avgjores om NOK/EUR-kursen er lavere 31. desember 2026 enn 1. januar 2026.",
    category: "economy",
    yesPrice: 0.38,
    liquidity: 1000,
    closeDate: "2026-12-31T00:00:00.000Z",
  },
  {
    title: "Vil boligprisene i Oslo falle mer enn 5% i 2026?",
    description: "Avgjores basert pa SSBs boligprisindeks for Oslo fra januar til desember 2026.",
    category: "economy",
    yesPrice: 0.2,
    liquidity: 1100,
    closeDate: "2027-01-15T00:00:00.000Z",
  },
];

async function seed() {
  // Check if markets already exist
  const existing = await client.execute("SELECT COUNT(*) as count FROM Market");
  if (existing.rows[0].count > 0) {
    console.log("Markets already exist, skipping seed.");
    return;
  }

  // Create demo user
  const now = new Date().toISOString();
  await client.execute({
    sql: `INSERT OR IGNORE INTO "User" (id, username, balance, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`,
    args: ["demo-user", "demo", 10000, now, now],
  });

  // Create markets
  for (const m of sampleMarkets) {
    const volume = Math.round(Math.random() * 5000 + 500);
    await client.execute({
      sql: `INSERT INTO "Market" (id, title, description, category, status, yesPrice, volume, liquidity, closeDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'open', ?, ?, ?, ?, ?, ?)`,
      args: [randomUUID(), m.title, m.description, m.category, m.yesPrice, volume, m.liquidity, m.closeDate, now, now],
    });
  }

  console.log(`Seeded ${sampleMarkets.length} Norwegian prediction markets.`);
}

seed().catch(console.error);
