import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  listAnimes,
  getAnimeById,
  createAnime,
  updateAnime,
  deleteAnime,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  logAdminAction,
  getAdminLogs,
  promoteUserToAdmin,
  demoteAdminToUser,
  grantPremium,
  revokePremium,
  getAllUsers,
  getDb,
} from "./db";

// Admin procedure - checks if user is admin
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Anime procedures
  anime: router({
    // Public: List all animes with pagination and search
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
          search: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const results = await listAnimes(input.limit, input.offset, input.search);
        return results;
      }),

    // Public: Get anime details
    detail: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const anime = await getAnimeById(input.id);
        if (!anime) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Anime not found" });
        }
        return anime;
      }),

    // Admin: Upload new anime
    upload: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          genre: z.string().optional(),
          episodes: z.number().default(0),
          status: z.enum(["ongoing", "completed", "upcoming"]).default("upcoming"),
          coverImageUrl: z.string().optional(),
          trailerUrl: z.string().optional(),
          releaseYear: z.number().optional(),
          isPremiumOnly: z.boolean().default(false),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const anime = await createAnime({
          ...input,
          uploadedBy: ctx.user.id,
        });

        // Log admin action
        await logAdminAction({
          adminId: ctx.user.id,
          action: "UPLOAD_ANIME",
          targetType: "ANIME",
          details: JSON.stringify({ title: input.title }),
        });

        return anime;
      }),

    // Admin: Update anime
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          genre: z.string().optional(),
          episodes: z.number().optional(),
          status: z.enum(["ongoing", "completed", "upcoming"]).optional(),
          coverImageUrl: z.string().optional(),
          trailerUrl: z.string().optional(),
          releaseYear: z.number().optional(),
          rating: z.number().optional(),
          isPremiumOnly: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, ...updates } = input;
        const anime = await getAnimeById(id);
        if (!anime) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Anime not found" });
        }

        await updateAnime(id, updates);

        // Log admin action
        await logAdminAction({
          adminId: ctx.user.id,
          action: "UPDATE_ANIME",
          targetId: id,
          targetType: "ANIME",
          details: JSON.stringify(updates),
        });

        return { success: true };
      }),

    // Admin: Delete anime
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const anime = await getAnimeById(input.id);
        if (!anime) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Anime not found" });
        }

        await deleteAnime(input.id);

        // Log admin action
        await logAdminAction({
          adminId: ctx.user.id,
          action: "DELETE_ANIME",
          targetId: input.id,
          targetType: "ANIME",
          details: JSON.stringify({ title: anime.title }),
        });

        return { success: true };
      }),
  }),

  // User procedures
  user: router({
    // Protected: Get user's favorites
    getFavorites: protectedProcedure.query(async ({ ctx }) => {
      return getUserFavorites(ctx.user.id);
    }),

    // Protected: Add to favorites
    addFavorite: protectedProcedure
      .input(z.object({ animeId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const anime = await getAnimeById(input.animeId);
        if (!anime) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Anime not found" });
        }

        await addToFavorites(ctx.user.id, input.animeId);
        return { success: true };
      }),

    // Protected: Remove from favorites
    removeFavorite: protectedProcedure
      .input(z.object({ animeId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await removeFromFavorites(ctx.user.id, input.animeId);
        return { success: true };
      }),
  }),

  // Admin procedures
  admin: router({
    // Admin: Get all users
    listUsers: adminProcedure
      .input(
        z.object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return getAllUsers(input.limit, input.offset);
      }),

    // Admin: Promote user to admin
    promoteToAdmin: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await promoteUserToAdmin(input.userId);

        // Log admin action
        await logAdminAction({
          adminId: ctx.user.id,
          action: "PROMOTE_TO_ADMIN",
          targetId: input.userId,
          targetType: "USER",
        });

        return { success: true };
      }),

    // Admin: Demote admin to user
    demoteToUser: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await demoteAdminToUser(input.userId);

        // Log admin action
        await logAdminAction({
          adminId: ctx.user.id,
          action: "DEMOTE_TO_USER",
          targetId: input.userId,
          targetType: "USER",
        });

        return { success: true };
      }),

    // Admin: Grant premium subscription
    grantPremium: adminProcedure
      .input(
        z.object({
          userId: z.number(),
          expiryDate: z.date(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await grantPremium(input.userId, input.expiryDate);

        // Log admin action
        await logAdminAction({
          adminId: ctx.user.id,
          action: "GRANT_PREMIUM",
          targetId: input.userId,
          targetType: "USER",
        });

        return { success: true };
      }),

    // Admin: Revoke premium subscription
    revokePremium: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await revokePremium(input.userId);

        // Log admin action
        await logAdminAction({
          adminId: ctx.user.id,
          action: "REVOKE_PREMIUM",
          targetId: input.userId,
          targetType: "USER",
        });

        return { success: true };
      }),

    // Admin: Get admin logs
    getLogs: adminProcedure
      .input(
        z.object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return getAdminLogs(input.limit, input.offset);
      }),
  }),
});

export type AppRouter = typeof appRouter;
