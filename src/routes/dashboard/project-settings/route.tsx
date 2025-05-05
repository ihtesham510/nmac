import { AgentSelect } from '@/components/select-agent'
import {
	ProjectSettingContextProvider,
	useProjetSettings,
} from '@/context/project-setting-context'
import { ProtectedClientRoute } from '@/hoc/protected-client-route'
import { createFileRoute, Outlet, type LinkProps } from '@tanstack/react-router'
import { BotIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/project-settings')({
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
	]

	return (
		<div className='w-full h-screen'>
			<div className='m-10 grid gap-4 space-y-4 relative'>
				<div className='grid gap-4 space-y-4 sticky top-0'>
					<div className='flex justify-between items-center'>
						<div className='grid gap-2'>
							<h1 className='text-4xl font-bold'>Project Settings</h1>
							<p className='text-primary/50 font-bold'>
								Mange your agent settings and configurations.
							</p>
						</div>
						<AgentSelect
							agents={agents}
							value={selectedAgent ?? null}
							className='w-[200px]'
							placeholder='All Agents'
							onSelect={agent => setSelectedAgent(agent)}
						/>
					</div>
					{agents.length === 0 ? (
						<div className='flex flex-col items-center justify-center py-16 px-4 rounded-lg bg-primary-foreground mt-4'>
							<div className='bg-muted/50 p-4 rounded-full mb-4'>
								<BotIcon className='h-10 w-10 text-muted-foreground' />
							</div>
							<h2 className='text-xl font-semibold mb-2'>No Agents found</h2>
							<p className='text-muted-foreground text-center max-w-md mb-8'>
								You haven't added any agents yet. Add agent to see analytics.
							</p>
						</div>
					) : (
						<header className='w-full border-b border-border'>
							<nav className='max-w-7xl mx-auto'>
								<div className='flex h-12 items-end'>
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
					<div className='lg:mx-40'>
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	)
}
