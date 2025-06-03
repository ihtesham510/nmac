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
		agents: v.optional(v.array(v.id('agent'))),
	},
	async handler(ctx, { userId, agents }) {
		if (agents) {
			const res = await Promise.all(
				agents.map(async agent => await ctx.db.get(agent)),
			)
			return res.filter(res => !!res)
		}
		if (userId)
			return await ctx.db
				.query('agent')
				.withIndex('by_userId', q => q.eq('userId', userId))
				.collect()
	},
})

export const getAgent = query({
	args: { agentId: v.optional(v.id('agent')) },
	async handler(ctx, args) {
		if (args.agentId) return await ctx.db.get(args.agentId)
		return null
	},
})

export const getAgentById = query({
	args: {
		agentId: v.optional(v.string()),
	},
	async handler(ctx, args) {
		const id = args.agentId
		if (id) {
			return await ctx.db
				.query('agent')
				.withIndex('by_agentId', q => q.eq('agentId', id))
				.first()
		}
		return null
	},
})

export const deleteAgent = mutation({
	args: {
		agentId: v.id('agent'),
	},
	async handler(ctx, args_0) {
		const clients = await ctx.db.query('client').collect()
		await Promise.all(
			clients.map(async client => {
				const contains_agent = client.assigned_Agents.includes(args_0.agentId)
				if (contains_agent) {
					await ctx.db.patch(client._id, {
						...client,
						assigned_Agents: client.assigned_Agents.filter(
							agent => agent !== args_0.agentId,
						),
					})
				}
			}),
		)
		return await ctx.db.delete(args_0.agentId)
	},
})
