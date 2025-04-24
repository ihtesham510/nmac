import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { decrypt, encrypt } from './utils'

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
		const secretKey = process.env.SECRET_KEY
		const encryptedPassword = encrypt(password, secretKey!)
		return await ctx.db.insert('user', {
			first_name,
			last_name,
			email,
			password: encryptedPassword,
			elevenLabs_api_key,
		})
	},
})
export const signIn = mutation({
	args: {
		username: v.string(),
		password: v.string(),
	},
	async handler(ctx, args) {
		const secretKey = process.env.SECRET_KEY
		const user = await ctx.db
			.query('user')
			.withIndex('by_email', q => q.eq('email', args.username))
			.first()
		const isUserAuthenticated =
			decrypt(user!.password, secretKey!) === args.password
		const client = await ctx.db
			.query('client')
			.withIndex('by_username', q => q.eq('username', args.username))
			.first()
		const isClientAuthenticated =
			decrypt(client!.password, secretKey!) === args.password
		if (user && isUserAuthenticated) return user._id
		if (client && isClientAuthenticated) return client._id
		return null
	},
})

export const emailExists = query({
	args: {
		email: v.string(),
	},
	async handler(ctx, args_0) {
		return !!(await ctx.db
			.query('user')
			.withIndex('by_email', q => q.eq('email', args_0.email))
			.first())
	},
})

export const authenticate = query({
	args: {
		id: v.optional(v.string()),
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
