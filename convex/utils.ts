import CryptoJS from 'crypto-js'
import type { MutationCtx, QueryCtx } from './_generated/server'
import type { Id } from './_generated/dataModel'
import { ConvexError } from 'convex/values'

export const encrypt = (value: string, secret_key: string) => {
	return CryptoJS.AES.encrypt(value, secret_key).toString()
}

export const decrypt = (cipherText: string, secret_key: string) => {
	try {
		const bytes = CryptoJS.AES.decrypt(cipherText, secret_key)
		return bytes.toString(CryptoJS.enc.Utf8)
	} catch (error) {
		console.error('Failed to decrypt value:', error)
		return null
	}
}
/**
 * Returns the credits based on the tier type
 * @param {number} type - type of the tier
 */
export const get_credits = (type: 'base' | 'pro' | 'business'): number => {
	switch (type) {
		case 'base':
			return 30000
		case 'pro':
			return 60000
		case 'business':
			return 120000
	}
}

export async function getClient(
	ctx: QueryCtx | MutationCtx,
	clientId: Id<'client'>,
) {
	const client = await ctx.db.get(clientId)
	if (!client) throw new ConvexError('client not found')
	return client
}

export async function getUser(ctx: QueryCtx | MutationCtx, userId: Id<'user'>) {
	const user = await ctx.db.get(userId)
	if (!user) throw new ConvexError('client not found')
	return user
}
