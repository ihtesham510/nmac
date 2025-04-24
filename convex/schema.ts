import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
	user: defineTable({
		first_name: v.string(),
		last_name: v.string(),
		email: v.string(),
		password: v.string(),
		elevenLabs_api_key: v.string(),
	}).index('by_email', ['email']),
	client: defineTable({
		userId: v.id('user'),
		name: v.string(),
		username: v.string(),
		password: v.string(),
		assigned_Agent: v.optional(v.string()),
	})
		.index('by_username', ['username'])
		.index('by_userId', ['userId']),
})
