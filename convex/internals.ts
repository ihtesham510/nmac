import { ConvexError, v } from 'convex/values'
import { internalMutation } from './_generated/server'
import { get_credits, getClient } from './utils'

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
								subscription: client.subscription
									? {
											...client.subscription,
											remaining_credits: Math.round(
												client.subscription.remaining_credits -
													totalCost(args.cost, 20),
											),
										}
									: undefined,
							})
						}
					}
				}
			}
		}
		return null
	},
})

export const resetCredits = internalMutation({
	args: {
		clientId: v.id('client'),
	},
	async handler(ctx, { clientId }) {
		const client = await getClient(ctx, clientId)
		if (!client.subscription)
			throw new ConvexError('Client does not have any subscription')

		const subscription = client.subscription
		const credits = get_credits(client.subscription.type)

		const subscriptionStartDate = new Date(subscription.subscribedAt)
		const subscriptionEndDate = new Date(subscriptionStartDate)
		subscriptionEndDate.setMonth(
			subscriptionEndDate.getMonth() + subscription.interval,
		)

		console.log('dates', [
			subscriptionStartDate.valueOf(),
			subscriptionEndDate.valueOf(),
		])

		const now = new Date(Date.now())

		if (now >= subscriptionEndDate) {
			console.log('subscription ended')
			return await ctx.db.patch(client._id, {
				...client,
				subscription: undefined,
			})
		} else {
			console.log('credits reseted')
			return await ctx.db.patch(client._id, {
				...client,
				subscription: {
					...subscription,
					updatedAt: now.valueOf(),
					total_credits: credits,
					remaining_credits: credits,
				},
			})
		}
	},
})

export const query_scheduled_function = internalMutation({
	args: {
		clientId: v.optional(v.id('client')),
	},
	async handler(ctx, args) {
		const funcs = await ctx.db.system.query('_scheduled_functions').collect()

		if (args.clientId) {
			return funcs.filter(
				func =>
					func.args[0].clientId === args.clientId &&
					func.state.kind !== 'canceled',
			)
		}

		return funcs
	},
})

export const cleanSchedules = internalMutation({
	async handler(ctx) {
		const clients = (await ctx.db.query('client').collect()).map(
			client => client._id,
		)

		const funcs = await ctx.db.system.query('_scheduled_functions').collect()

		const fnToRemove = funcs.filter(fn => {
			return !clients.includes(fn.args[0].clientId)
		})

		fnToRemove.forEach(async fn => await ctx.scheduler.cancel(fn._id))
		return fnToRemove
	},
})
