import { eq, desc, and, like, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, animes, userFavorites, adminLogs, InsertAnime, InsertAdminLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Anime queries
export async function listAnimes(limit: number = 20, offset: number = 0, search?: string, premiumOnly?: boolean) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (search) {
    conditions.push(like(animes.title, `%${search}%`));
  }
  if (premiumOnly !== undefined) {
    conditions.push(eq(animes.isPremiumOnly, premiumOnly));
  }

  let query = db.select().from(animes);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  return query.orderBy(desc(animes.createdAt)).limit(limit).offset(offset);
}

export async function getAnimeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(animes).where(eq(animes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAnime(anime: InsertAnime) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(animes).values(anime);
  return result;
}

export async function updateAnime(id: number, updates: Partial<InsertAnime>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(animes).set(updates).where(eq(animes.id, id));
}

export async function deleteAnime(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(animes).where(eq(animes.id, id));
}

// User favorites
export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(userFavorites).where(eq(userFavorites.userId, userId));
}

export async function addToFavorites(userId: number, animeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(userFavorites).values({ userId, animeId });
}

export async function removeFromFavorites(userId: number, animeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(userFavorites).where(
    and(eq(userFavorites.userId, userId), eq(userFavorites.animeId, animeId))
  );
}

// Admin logs
export async function logAdminAction(log: InsertAdminLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(adminLogs).values(log);
}

export async function getAdminLogs(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(adminLogs).orderBy(desc(adminLogs.createdAt)).limit(limit).offset(offset);
}

// User management
export async function promoteUserToAdmin(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(users).set({ role: 'admin' }).where(eq(users.id, userId));
}

export async function demoteAdminToUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(users).set({ role: 'user' }).where(eq(users.id, userId));
}

export async function grantPremium(userId: number, expiryDate: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(users).set({ isPremium: true, premiumExpiryAt: expiryDate }).where(eq(users.id, userId));
}

export async function revokePremium(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(users).set({ isPremium: false, premiumExpiryAt: null }).where(eq(users.id, userId));
}

export async function getAllUsers(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(users).orderBy(desc(users.createdAt)).limit(limit).offset(offset);
}
