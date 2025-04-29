import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const createAgent = mutation({
	args: {
		name: v.string(),
		description: v.string(),
		tags: v.array(v.string()),
		userId: v.id('user'),
		agentId: v.string(),
	},
	async handler(ctx, args) {
		return await ctx.db.insert('agent', args)
	},
})

export const getAgents = query({
	args: {
		userId: v.optional(v.id('user')),
	},
	async handler(ctx, { userId }) {
		if (userId)
			return await ctx.db
				.query('agent')
				.withIndex('by_userId', q => q.eq('userId', userId))
				.collect()
	},
})

export const getAgent = query({
	args: { agentId: v.id('agent') },
	async handler(ctx, args) {
		return await ctx.db.get(args.agentId)
	},
})

export const deleteAgent = mutation({
	args: {
		agentId: v.id('agent'),
	},
	async handler(ctx, args_0) {
		return await ctx.db.delete(args_0.agentId)
	},
})
