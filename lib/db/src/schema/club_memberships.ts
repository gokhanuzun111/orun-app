import { pgTable, serial, text, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const clubMembersTable = pgTable(
  "club_members",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    clubId: text("club_id").notNull(),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (t) => ({
    userClubUnique: uniqueIndex("club_members_user_club_unique").on(t.userId, t.clubId),
  }),
);

export const clubWaitlistTable = pgTable(
  "club_waitlist",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    clubId: text("club_id").notNull(),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (t) => ({
    userClubUnique: uniqueIndex("club_waitlist_user_club_unique").on(t.userId, t.clubId),
  }),
);

export type ClubMember = typeof clubMembersTable.$inferSelect;
export type ClubWaitlistEntry = typeof clubWaitlistTable.$inferSelect;
