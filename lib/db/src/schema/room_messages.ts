import { pgTable, serial, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const roomMessagesTable = pgTable(
  "room_messages",
  {
    id: serial("id").primaryKey(),
    roomId: text("room_id").notNull(),
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => ({
    roomCreatedIdx: index("room_messages_room_created_idx").on(t.roomId, t.createdAt),
  }),
);

export type RoomMessage = typeof roomMessagesTable.$inferSelect;
export type NewRoomMessage = typeof roomMessagesTable.$inferInsert;
