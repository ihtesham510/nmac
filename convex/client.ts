import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { encrypt } from './utils'

export const createClient = mutation({
	args: {
		userId: v.id('user'),
		name: v.string(),
		email: v.optional(v.string()),
		username: v.string(),
		password: v.string(),
	},
	async handler(ctx, { userId, username, name, password, email }) {
		const secretKey = process.env.SECRET_KEY
		const encryptedPassword = encrypt(password, secretKey!)
		return await ctx.db.insert('client', {
			userId,
			email,
			name,
			assigned_Agents: [],
			username,
			password: encryptedPassword,
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
		email: v.optional(v.string()),
		password: v.optional(v.string()),
	},
	async handler(ctx, args) {
		const secretKey = process.env.SECRET_KEY
		const client = await ctx.db.get(args.clientId)
		if (client) {
			const encryptedPassword = args.password
				? encrypt(args.password, secretKey!)
				: client?.password

			return await ctx.db.patch(args.clientId, {
				userId: client.userId,
				password: encryptedPassword,
				email: args.email ?? client.email,
				username: args.username ?? client.username,
				assigned_Agents: client.assigned_Agents,
				name: args.name ?? client.name,
				...client.subscription,
			})
		}
	},
})

export const assignAgent = mutation({
	args: {
		clientId: v.id('client'),
		agents: v.array(v.id('agent')),
	},
	async handler(ctx, args) {
		const client = await ctx.db.get(args.clientId)
		if (client) {
			await ctx.db.patch(args.clientId, {
				...client,
				assigned_Agents: args.agents,
			})
		}
	},
})

export const deleteClient = mutation({
	args: {
		clientId: v.id('client'),
	},
	async handler(ctx, args_0) {
		return await ctx.db.delete(args_0.clientId)
	},
})

export const authenticate = query({
	args: { id: v.optional(v.string()) },
	async handler(ctx, args) {
		if (args.id) {
			try {
				const id = ctx.db.normalizeId('client', args.id)
				if (id) {
					const client = await ctx.db.get(id)
					const user = await ctx.db.get(client!.userId)
					return { ...client, api_key: user!.elevenLabs_api_key }
				}
			} catch (err) {
				return null
			}
		}
		return null
	},
})
export const usernameExists = query({
	args: {
		username: v.string(),
	},
	async handler(ctx, args_0) {
		return !!(await ctx.db
			.query('client')
			.withIndex('by_username', q => q.eq('username', args_0.username))
			.first())
	},
})

export const emailExists = query({
	args: {
		email: v.string(),
	},
	async handler(ctx, args_0) {
		return !!(await ctx.db
			.query('client')
			.withIndex('by_email', q => q.eq('email', args_0.email))
			.first())
	},
})
