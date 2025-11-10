import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  /** Premium subscription status */
  isPremium: boolean("isPremium").default(false).notNull(),
  /** Premium expiry date */
  premiumExpiryAt: timestamp("premiumExpiryAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Anime table for storing anime information
 */
export const animes = mysqlTable("animes", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  genre: varchar("genre", { length: 255 }), // comma-separated genres
  episodes: int("episodes").default(0),
  status: mysqlEnum("status", ["ongoing", "completed", "upcoming"]).default("upcoming").notNull(),
  coverImageUrl: text("coverImageUrl"),
  trailerUrl: text("trailerUrl"),
  releaseYear: int("releaseYear"),
  rating: int("rating").default(0), // 0-100 scale
  views: int("views").default(0),
  /** Only premium users can watch */
  isPremiumOnly: boolean("isPremiumOnly").default(false).notNull(),
  /** User ID of the uploader (admin/owner) */
  uploadedBy: int("uploadedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Anime = typeof animes.$inferSelect;
export type InsertAnime = typeof animes.$inferInsert;

/**
 * User favorites/watchlist
 */
export const userFavorites = mysqlTable("userFavorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  animeId: int("animeId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = typeof userFavorites.$inferInsert;

/**
 * Admin activity logs
 */
export const adminLogs = mysqlTable("adminLogs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  action: varchar("action", { length: 255 }).notNull(), // e.g., "UPLOAD_ANIME", "DELETE_ANIME", "PROMOTE_USER"
  targetId: int("targetId"), // ID of the affected resource (anime ID, user ID, etc.)
  targetType: varchar("targetType", { length: 64 }), // e.g., "ANIME", "USER"
  details: text("details"), // JSON string with additional info
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = typeof adminLogs.$inferInsert;
