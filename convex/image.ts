import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const getUploadUrl = mutation({
	async handler(ctx) {
		return await ctx.storage.generateUploadUrl()
	},
})
export const getImageUrl = mutation({
	args: {
		id: v.id('_storage'),
	},
	async handler(ctx, args) {
		return await ctx.storage.getUrl(args.id)
	},
})
