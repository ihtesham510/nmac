import { useElevenLabsClient } from '@/api/client'
import { queries } from '@/api/query-options'
import { useQuery } from '@/cache/useQuery'
import { AgentContextProvider } from '@/context/agent-context'
import { useQuery as useTanstackQuery } from '@tanstack/react-query'
import {
	createFileRoute,
	Navigate,
	Outlet,
	type LinkProps,
	Link,
} from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/agents/$agent')({
	component: RouteComponent,
})

const links: { title: string; href: LinkProps }[] = [
	{
		title: 'Agent',
		href: { to: '/dashboard/agents/$agent/agent' },
	},
	{
		title: 'Voice',
		href: { to: '/dashboard/agents/$agent/voice' },
	},
	{
		title: 'Preview',
		href: { to: '/dashboard/agents/$agent/preview' },
	},
]

function RouteComponent() {
	const { agent } = Route.useParams()
	const client = useElevenLabsClient()
	const agentRes = useTanstackQuery(
		queries.get_agent(client, {
			id: agent,
			enabled: true,
		}),
	)
	const agentData = useQuery(api.agents.getAgentById, {
		agentId: agentRes.data?.agent_id,
	})
	const isLoading =
		agentRes.isLoading ||
		(!agentRes.isError && agentRes.data && typeof agentData === 'undefined')

	if (agentRes.isError) {
		return <Navigate to='/dashboard/agents/404' />
	}

	return (
		<div className='m-10 md:mx-40 grid space-y-6'>
			{isLoading ? (
				<div className='flex items-center justify-between mb-6'>
					<div className='grid gap-2'>
						<Skeleton className='h-10 w-24 py-4 mb-4' />
						<Skeleton className='h-10 w-64 mb-1' />
						<Skeleton className='h-7 w-80 mb-2' />
						<div className='flex gap-2'>
							<Skeleton className='h-6 w-20 rounded-full' />
							<Skeleton className='h-6 w-24 rounded-full' />
							<Skeleton className='h-6 w-16 rounded-full' />
						</div>
					</div>
				</div>
			) : (
				<div className='flex items-center justify-between mb-6'>
					<div className='grid gap-2'>
						<h1 className='text-4xl font-bold'>{agentData?.name}</h1>
						<p className='font-semibold text-primary/50 max-w-[500px]'>
							{agentData?.description}
						</p>
						<span>
							{agentData?.tags.map(tag => (
								<Badge key={tag} variant='secondary' className='text-xs'>
									<Tag className='h-3 w-3 mr-1' />
									{tag}
								</Badge>
							))}
						</span>
					</div>
				</div>
			)}

			{isLoading ? (
				<header className='border-b border-border'>
					<nav className='max-w-7xl'>
						<div className='flex h-12 items-end justify-between'>
							<div className='flex space-x-6'>
								<Skeleton className='h-6 w-12 mb-2' />
								<Skeleton className='h-6 w-16 mb-2' />
								<Skeleton className='h-6 w-20 mb-2' />
							</div>
						</div>
					</nav>
				</header>
			) : (
				<header className='border-b border-border'>
					<nav className='max-w-7xl'>
						<div className='flex h-12 items-end justify-between'>
							<div className='flex space-x-6'>
								{links.map((item, index) => (
									<Link
										key={index}
										{...item.href}
										className={cn(
											'inline-flex h-full items-end border-b-1 pb-2 text-md font-medium transition-colors',
											'text-zinc-400 border-transparent hover:border-zinc-600 hover:text-zinc-300',
											'[&.active]:border-white [&.active]:text-white',
										)}
									>
										{item.title}
									</Link>
								))}
							</div>
						</div>
					</nav>
				</header>
			)}

			<AgentContextProvider
				agent={agentRes}
				isLoading={!!isLoading}
				agentData={agentData}
			>
				<Outlet />
			</AgentContextProvider>
		</div>
	)
}
