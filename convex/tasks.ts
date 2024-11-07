import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const createTask = mutation({
  args: { text: v.string(), isCompleted: v.boolean() },
  handler: async (ctx, args) => {
    const taskId = { text: args.text, isCompleted: args.isCompleted };
    return await ctx.db.insert("tasks", taskId);
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateTask = mutation({
  args: {
    id: v.id("tasks"),         
    text: v.string(),      
    isCompleted: v.boolean(),
  },
  handler: async (ctx, { id, text, isCompleted }) => {
    await ctx.db.patch(id, { text, isCompleted });
  },
});