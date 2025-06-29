import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const cron = cronJobs()

cron.daily(
	'clean schedules',
	{
		hourUTC: 17,
		minuteUTC: 30,
	},
	internal.internals.cleanSchedules,
)

export default cron
