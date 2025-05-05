import { v } from 'convex/values'
import { internalMutation } from './_generated/server'

export const deduct = internalMutation({
	args: {
		agent_id: v.string(),
		cost: v.number(),
	},
	async handler(ctx, args) {
		const agentExist = await ctx.db
			.query('agent')
			.withIndex('by_agentId', q => q.eq('agentId', args.agent_id))
			.first()
		if (agentExist) {
			const clients = await ctx.db.query('client').collect()
			for (const client of clients) {
				for (const a of client.assigned_Agents) {
					const agent = await ctx.db.get(a)
					if (agent) {
						const totalCost = (cost: number, percentage: number) =>
							cost + cost * (percentage / 100)
						if (agent.agentId === args.agent_id) {
							await ctx.db.patch(client._id, {
								...client,
								credits: client.credits - totalCost(args.cost, 20),
							})
						}
					}
				}
			}
		}
		return null
	},
})
