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
		const client = await ctx.db
			.query('client')
			.withIndex('by_username', q => q.eq('username', args.username))
			.first()
		if (user) {
			const decrypted_password = decrypt(user.password, secretKey!)
			if (decrypted_password === args.password) {
				return user._id
			}
		}
		if (client) {
			const decrypted_password = decrypt(client.password, secretKey!)
			if (decrypted_password === args.password) {
				return client._id
			}
		}
		return null
	},
})

export const checkUser = query({
	args: {
		username: v.string(),
		password: v.string(),
	},
	async handler(ctx, { username, password }) {
		const secretKey = process.env.SECRET_KEY
		const user = await ctx.db
			.query('user')
			.withIndex('by_email', q => q.eq('email', username))
			.first()
		const client = await ctx.db
			.query('client')
			.withIndex('by_username', q => q.eq('username', username))
			.first()
		if (user) {
			const decrypted_password = decrypt(user.password, secretKey!)
			if (decrypted_password === password) {
				return user._id
			} else {
				return 'incorrect_password'
			}
		}
		if (client) {
			const decrypted_password = decrypt(client.password, secretKey!)
			if (decrypted_password === password) {
				return client._id
			} else {
				return 'incorrect_password'
			}
		}
		return 'user_not_found'
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

export const updateImage = mutation({
	args: {
		userId: v.id('user'),
		url: v.string(),
		storageId: v.id('_storage'),
	},
	async handler(ctx, args_0) {
		const user = await ctx.db.get(args_0.userId)
		if (user) {
			if (user.image) {
				await ctx.storage.delete(user.image.storageId)
			}
			return await ctx.db.patch(user._id, {
				image: {
					url: args_0.url,
					storageId: args_0.storageId,
				},
			})
		}
	},
})

export const changePassword = mutation({
	args: {
		userId: v.id('user'),
		current_password: v.string(),
		new_password: v.string(),
	},
	async handler(ctx, { current_password, new_password, userId }) {
		const secretKey = process.env.SECRET_KEY
		const user = await ctx.db.get(userId)
		if (user) {
			const user_password = decrypt(user.password, secretKey!)
			if (current_password === user_password) {
				return await ctx.db.patch(user._id, {
					...user,
					password: encrypt(new_password, secretKey!),
				})
			} else {
				return 'wrong_password'
			}
		}
	},
})

export const deleteAccount = mutation({
	args: {
		userId: v.id('user'),
	},
	async handler(ctx, args) {
		const clients = await ctx.db
			.query('client')
			.withIndex('by_userId', q => q.eq('userId', args.userId))
			.collect()
		await Promise.all([
			clients.map(async client => await ctx.db.delete(client._id)),
		])
		return await ctx.db.delete(args.userId)
	},
})
