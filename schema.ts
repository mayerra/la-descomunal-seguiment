import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projectUpdates = sqliteTable("project_updates", {
  projectId: text("project_id").primaryKey(),
  status: text("status").notNull().default("pendent"),
  progress: integer("progress").notNull().default(0),
  startDate: text("start_date"),
  endDate: text("end_date"),
  nextMilestone: text("next_milestone").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const indicatorUpdates = sqliteTable("indicator_updates", {
  indicatorId: text("indicator_id").primaryKey(),
  actualValue: real("actual_value"),
  notes: text("notes").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
