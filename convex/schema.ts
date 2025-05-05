import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
	user: defineTable({
		image: v.optional(
			v.object({
				url: v.string(),
				storageId: v.id('_storage'),
			}),
		),
		first_name: v.string(),
		last_name: v.string(),
		email: v.string(),
		password: v.string(),
		elevenLabs_api_key: v.string(),
	}).index('by_email', ['email']),
	client: defineTable({
		userId: v.id('user'),
		name: v.string(),
		credits: v.number(),
		username: v.string(),
		password: v.string(),
		email: v.optional(v.string()),
		assigned_Agents: v.array(v.id('agent')),
	})
		.index('by_username', ['username'])
		.index('by_email', ['email'])
		.index('by_userId', ['userId']),
	agent: defineTable({
		name: v.string(),
		description: v.string(),
		tags: v.array(v.string()),
		userId: v.id('user'),
		agentId: v.string(),
	})
		.index('by_userId', ['userId'])
		.index('by_agentId', ['agentId']),
})
