import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const registerUser = mutation({
	args: {
		first_name: v.string(),
		last_name: v.string(),
		email: v.string(),
		password: v.string(),
		elevenLabs_api_key: v.string(),
	},
	handler: async (
		ctx,
		{ first_name, last_name, email, password, elevenLabs_api_key },
	) => {
		return await ctx.db.insert('user', {
			first_name,
			last_name,
			email,
			password,
			elevenLabs_api_key,
		})
	},
})

export const authenticate = query({
	args: {
		id: v.optional(v.id('user')),
	},
	async handler(ctx, args) {
		if (args.id) {
			const id = ctx.db.normalizeId('user', args.id)
			if (id) {
				return await ctx.db.get(id)
			}
		}
		return null
	},
})

export const signIn = mutation({
	args: {
		username: v.string(),
		password: v.string(),
	},
	async handler(ctx, args) {
		const user = await ctx.db
			.query('user')
			.withIndex('by_email', q => q.eq('email', args.username))
			.first()
		const client = await ctx.db
			.query('client')
			.withIndex('by_username', q => q.eq('username', args.username))
			.first()
		if (user) return user._id
		if (client) return client._id
		return null
	},
})
