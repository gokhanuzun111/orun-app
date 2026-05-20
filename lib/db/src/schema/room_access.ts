import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const roomAccessTable = pgTable("room_access", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  roomId: text("room_id").notNull(),
  clubId: text("club_id").notNull(),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const roomWaitlistTable = pgTable("room_waitlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  roomId: text("room_id").notNull(),
  clubId: text("club_id").notNull(),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  notifiedAt: timestamp("notified_at"),
});

export type RoomAccess = typeof roomAccessTable.$inferSelect;
export type RoomWaitlistEntry = typeof roomWaitlistTable.$inferSelect;
