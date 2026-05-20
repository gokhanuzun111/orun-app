import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  handle: text("handle").notNull().unique(),
  bio: text("bio").notNull().default(""),
  membershipLevel: integer("membership_level").notNull().default(0),
  interests: jsonb("interests").$type<string[]>().notNull().default([]),
  joinedClubs: jsonb("joined_clubs").$type<string[]>().notNull().default([]),
  clubJoinDates: jsonb("club_join_dates").$type<Record<string, string>>().notNull().default({}),
  reputation: integer("reputation").notNull().default(0),
  isAdmin: boolean("is_admin").notNull().default(false),
  isBanned: boolean("is_banned").notNull().default(false),
  memberSince: text("member_since").notNull(),
  revenueCatId: text("revenuecat_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
