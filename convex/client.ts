import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const createClient = mutation({
	args: {
		userId: v.id('user'),
		name: v.string(),
		username: v.string(),
		password: v.string(),
	},
	async handler(ctx, { userId, username, name, password }) {
		return await ctx.db.insert('client', {
			userId,
			name,
			username,
			password,
		})
	},
})

export const listClients = query({
	args: { id: v.id('user') },
	async handler(ctx, args) {
		return await ctx.db
			.query('client')
			.withIndex('by_userId', q => q.eq('userId', args.id))
			.collect()
	},
})

export const updateClient = mutation({
	args: {
		clientId: v.id('client'),
		username: v.string(),
		name: v.string(),
		password: v.string(),
	},
	async handler(ctx, args) {
		const client = await ctx.db.get(args.clientId)
		return await ctx.db.patch(args.clientId, {
			username: args.username,
			password: args.password,
			name: args.name,
			...client,
		})
	},
})

export const assignAgent = mutation({
	args: {
		clientId: v.id('client'),
		agentId: v.string(),
	},
	async handler(ctx, args) {
		const client = await ctx.db.get(args.clientId)
		return await ctx.db.patch(args.clientId, {
			...client,
			assigned_Agent: args.agentId,
		})
	},
})

export const authenticate = query({
	args: { id: v.optional(v.id('client')) },
	async handler(ctx, args) {
		if (args.id) {
			const id = ctx.db.normalizeId('client', args.id)
			if (id) {
				const client = await ctx.db.get(args.id)
				const user = await ctx.db.get(client!.userId)
				return { ...client, api_key: user!.elevenLabs_api_key }
			}
		}
		return null
	},
})
