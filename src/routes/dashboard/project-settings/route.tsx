import {
	createFileRoute,
	Link,
	type LinkProps,
	Outlet,
} from '@tanstack/react-router'
import { BotIcon } from 'lucide-react'
import { AgentSelect } from '@/components/select-agent'
import {
	ProjectSettingContextProvider,
	useProjetSettings,
} from '@/context/project-setting-context'
import { ProtectedClientRoute } from '@/hoc/protected-client-route'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/project-settings')({
	async beforeLoad({ context: { queryClient } }) {
		await queryClient.invalidateQueries({ queryKey: ['get_agent'] })
	},
	component: () => (
		<ProtectedClientRoute>
			<ProjectSettingContextProvider>
				<RouteComponent />
			</ProjectSettingContextProvider>
		</ProtectedClientRoute>
	),
})

function RouteComponent() {
	const { selectedAgent, setSelectedAgent, agents } = useProjetSettings()
	const links: { title: string; href: LinkProps }[] = [
		{
			title: 'Agent',
			href: { to: '/dashboard/project-settings/agent' },
		},
		{
			title: 'Voice',
			href: { to: '/dashboard/project-settings/voice' },
		},
		{
			title: 'Preview',
			href: { to: '/dashboard/project-settings/preview' },
		},
	]
	return (
		<div className='m-10 grid space-y-6 md:mx-40'>
			<div className='mb-6 flex items-center justify-between'>
				<div className='grid gap-2'>
					<h1 className='font-bold text-4xl'>Project Settings</h1>
					<p className='font-semibold text-primary/50'>
						Manage your agent settings and configurations.
					</p>
				</div>
			</div>
			{agents.length === 0 ? (
				<div className='mt-4 flex flex-col items-center justify-center rounded-lg bg-primary-foreground px-4 py-16'>
					<div className='mb-4 rounded-full bg-muted/50 p-4'>
						<BotIcon className='h-10 w-10 text-muted-foreground' />
					</div>
					<h2 className='mb-2 font-semibold text-xl'>No Agents found</h2>
					<p className='mb-8 max-w-md text-center text-muted-foreground'>
						You haven't added any agents yet. Add agent to see analytics.
					</p>
				</div>
			) : (
				<>
					<header className='border-border border-b'>
						<nav className='max-w-7xl'>
							<div className='flex h-12 items-end justify-between'>
								<div className='flex space-x-6'>
									{links.map((item, index) => (
										<Link
											key={index}
											{...item.href}
											className={cn(
												'inline-flex h-full items-end border-b-1 pb-2 font-medium text-md transition-colors',
												'border-transparent text-zinc-400 hover:border-zinc-600 hover:text-zinc-300',
												'[&.active]:border-white [&.active]:text-white',
											)}
										>
											{item.title}
										</Link>
									))}
								</div>
								<div className='pb-2'>
									<AgentSelect
										agents={agents}
										value={selectedAgent ?? null}
										className='w-[200px]'
										placeholder='All Agents'
										onSelect={agent => setSelectedAgent(agent)}
									/>
								</div>
							</div>
						</nav>
					</header>
					<Outlet />
				</>
			)}
		</div>
	)
}
