"use server";

import { prisma } from "./db";
import { calculateBuyCost, calculateSellReturn } from "./amm";
import { revalidatePath } from "next/cache";

const DEMO_USER_ID = "demo-user";

const DEFAULT_USER = {
  id: DEMO_USER_ID,
  username: "demo",
  balance: 10000,
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function getOrCreateDemoUser() {
  try {
    let user = await prisma.user.findUnique({ where: { id: DEMO_USER_ID } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: DEMO_USER_ID,
          username: "demo",
          balance: 10000,
        },
      });
    }
    return user;
  } catch {
    return DEFAULT_USER;
  }
}

export async function executeTrade(
  marketId: string,
  side: "yes" | "no",
  direction: "buy" | "sell",
  shares: number
) {
  const user = await getOrCreateDemoUser();
  const market = await prisma.market.findUnique({ where: { id: marketId } });

  if (!market) throw new Error("Market not found");
  if (market.status !== "open") throw new Error("Market is not open for trading");
  if (shares <= 0) throw new Error("Shares must be positive");

  let result;
  if (direction === "buy") {
    result = calculateBuyCost(market.yesPrice, side, shares, market.liquidity);
    if (result.cost > user.balance) {
      throw new Error("Insufficient balance");
    }

    await prisma.$transaction([
      prisma.trade.create({
        data: {
          userId: user.id,
          marketId: market.id,
          side,
          direction,
          shares: result.shares,
          price: result.avgPrice,
          cost: result.cost,
        },
      }),
      prisma.market.update({
        where: { id: market.id },
        data: {
          yesPrice: result.newYesPrice,
          volume: { increment: result.cost },
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: result.cost } },
      }),
    ]);
  } else {
    result = calculateSellReturn(market.yesPrice, side, shares, market.liquidity);

    await prisma.$transaction([
      prisma.trade.create({
        data: {
          userId: user.id,
          marketId: market.id,
          side,
          direction,
          shares: result.shares,
          price: result.avgPrice,
          cost: result.cost,
        },
      }),
      prisma.market.update({
        where: { id: market.id },
        data: {
          yesPrice: result.newYesPrice,
          volume: { increment: result.cost },
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { balance: { increment: result.cost } },
      }),
    ]);
  }

  revalidatePath(`/markets/${marketId}`);
  revalidatePath("/");
  revalidatePath("/markets");
  revalidatePath("/portfolio");

  return result;
}

export async function getUser() {
  return getOrCreateDemoUser();
}

export async function getMarkets(category?: string) {
  try {
    const where = category ? { category } : {};
    return await prisma.market.findMany({
      where,
      orderBy: { volume: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getMarket(id: string) {
  try {
    return await prisma.market.findUnique({
      where: { id },
      include: {
        trades: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { user: true },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getUserPositions() {
  try {
    const user = await getOrCreateDemoUser();
    const trades = await prisma.trade.findMany({
      where: { userId: user.id },
      include: { market: true },
      orderBy: { createdAt: "desc" },
    });

    // Aggregate positions per market per side
    const positionMap = new Map<
      string,
      {
        market: typeof trades[0]["market"];
        yesShares: number;
        noShares: number;
        totalCost: number;
      }
    >();

    for (const trade of trades) {
      const key = trade.marketId;
      if (!positionMap.has(key)) {
        positionMap.set(key, {
          market: trade.market,
          yesShares: 0,
          noShares: 0,
          totalCost: 0,
        });
      }
      const pos = positionMap.get(key)!;
      const multiplier = trade.direction === "buy" ? 1 : -1;
      if (trade.side === "yes") {
        pos.yesShares += trade.shares * multiplier;
      } else {
        pos.noShares += trade.shares * multiplier;
      }
      pos.totalCost += trade.cost * (trade.direction === "buy" ? 1 : -1);
    }

    return Array.from(positionMap.values()).filter(
      (p) => p.yesShares > 0 || p.noShares > 0
    );
  } catch {
    return [];
  }
}
