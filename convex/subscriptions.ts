import { v, ConvexError } from 'convex/values'
import { mutation } from './_generated/server'
import { internal } from './_generated/api'
import { get_credits, getClient } from './utils'

export const subscribeTier = mutation({
	args: {
		interval: v.number(),
		type: v.union(v.literal('base'), v.literal('pro'), v.literal('business')),
		clientId: v.id('client'),
	},
	async handler(ctx, { clientId, type, interval }) {
		const client = await getClient(ctx, clientId)
		const credits = get_credits(type)
		if (client.subscription)
			throw new ConvexError('Client already has a subscription')

		const validInterval = interval < 1 ? 1 : interval

		const currentDate = Date.now()

		for (let i = 1; i <= validInterval; i++) {
			const scheduleDate = new Date(currentDate)
			scheduleDate.setMonth(scheduleDate.getMonth() + i)

			await ctx.scheduler.runAt(scheduleDate, internal.internals.resetCredits, {
				clientId: client._id,
			})
		}

		return await ctx.db.patch(client._id, {
			...client,
			subscription: {
				type: type,
				interval: validInterval,
				subscribedAt: new Date(currentDate).valueOf(),
				updatedAt: new Date(currentDate).valueOf(),
				total_credits: credits,
				remaining_credits: credits,
			},
		})
	},
})

export const updateSubscription = mutation({
	args: {
		interval: v.number(),
		type: v.union(v.literal('base'), v.literal('pro'), v.literal('business')),
		clientId: v.id('client'),
	},
	async handler(ctx, { interval, type, clientId }) {
		const validInterval = interval < 1 ? 1 : interval
		const client = await getClient(ctx, clientId)
		const credits = get_credits(type)

		if (!client.subscription) {
			throw new ConvexError('Client has no subscription')
		}

		const deductedCredits =
			client.subscription.total_credits - client.subscription.remaining_credits

		const functions = (
			await ctx.db.system.query('_scheduled_functions').collect()
		).filter(func => func.args[0].clientId === client._id)

		const orignalSubscriptionDate = client.subscription.subscribedAt
		const oldInterval = client.subscription.interval
		const newInterval = validInterval
		/*
		 * if the new intervals ( months ) is greater then the old interval
		 * add the schedule functions and update the data
		 * */
		if (newInterval > oldInterval) {
			for (let i = oldInterval + 1; i <= newInterval; i++) {
				const scheduleDate = new Date(orignalSubscriptionDate)
				scheduleDate.setMonth(scheduleDate.getMonth() + i)
				const existingFn = functions.find(
					fn =>
						fn.scheduledTime === scheduleDate.valueOf() &&
						fn.state.kind !== 'canceled',
				)

				if (
					(existingFn && existingFn.state.kind !== 'canceled') ||
					!existingFn
				) {
					await ctx.scheduler.runAt(
						scheduleDate,
						internal.internals.resetCredits,
						{
							clientId: client._id,
						},
					)
				}
			}
		}
		/*
		 * if the new intervals ( months ) is smaller then the old interval
		 * delete the schedule functions and update the data
		 * */
		if (newInterval < oldInterval) {
			for (let i = newInterval + 1; i <= oldInterval; i++) {
				const scheduleDate = new Date(orignalSubscriptionDate)
				scheduleDate.setMonth(scheduleDate.getMonth() + i)
				const funcToCancel = functions.find(
					fn =>
						fn.scheduledTime === scheduleDate.valueOf() &&
						fn.state.kind !== 'canceled',
				)
				if (funcToCancel) {
					await ctx.scheduler.cancel(funcToCancel._id)
				}
			}
		}

		return await ctx.db.patch(client._id, {
			...client,
			subscription: {
				...client.subscription,
				type,
				interval: newInterval,
				total_credits: credits,
				remaining_credits: credits - deductedCredits,
				updatedAt: new Date(Date.now()).valueOf(),
			},
		})
	},
})

export const unSubscribeTier = mutation({
	args: {
		clientId: v.id('client'),
	},
	async handler(ctx, { clientId }) {
		const client = await getClient(ctx, clientId)
		const funcs = await ctx.runMutation(
			internal.internals.query_scheduled_function,
			{ clientId },
		)
		funcs.forEach(async fn => {
			await ctx.scheduler.cancel(fn._id)
		})
		return await ctx.db.patch(client._id, {
			...client,
			subscription: undefined,
		})
	},
})
