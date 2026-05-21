import { pgTable, serial, text, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const eventRsvpsTable = pgTable(
  "event_rsvps",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    eventId: text("event_id").notNull(),
    rsvpedAt: timestamp("rsvped_at").notNull().defaultNow(),
  },
  (t) => ({
    userEventUnique: uniqueIndex("event_rsvps_user_event_unique").on(t.userId, t.eventId),
  }),
);

export type EventRsvp = typeof eventRsvpsTable.$inferSelect;
