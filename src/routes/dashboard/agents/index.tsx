import { useQuery as useTanstackQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useMutation } from 'convex/react'
import { format } from 'date-fns'
import {
	Bot,
	Copy,
	LinkIcon,
	MoreHorizontal,
	PencilIcon,
	PlusIcon,
	Search,
	Tag,
	Trash2,
} from 'lucide-react'
import * as React from 'react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useElevenLabsClient } from '@/api/client'
import { queries } from '@/api/query-options'
import { useQuery } from '@/cache/useQuery'
import { AddAgentForm } from '@/components/forms/add-agent-form'
import { EditAgentForm } from '@/components/forms/edit-agent-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { WarnDialog } from '@/components/utils/warn-dialog'
import { useAuth } from '@/context/auth-context'
import { useDialog } from '@/hooks/use-dialogs'
import { rabinKarpSearch } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/agents/')({
	component: RouteComponent,
})

function RouteComponent() {
	const auth = useAuth()
	const navigate = useNavigate()
	const client = useElevenLabsClient()
	const conv_agents = useTanstackQuery(queries.list_agents(client))
	const deleteAgent = useMutation(api.agents.deleteAgent)
	const data = useQuery(api.agents.getAgents, { userId: auth.user?._id })
	const [filter, setFilter] = useState<string>()
	const [dialogs, setDialogs] = useDialog({
		warnDelete: false,
		addAgent: false,
		editAgent: false,
		updateAgent: false,
	})

	const agents = useMemo(() => {
		if (data && (!filter || filter === '')) {
			return data
		}
		return data?.filter(agent =>
			rabinKarpSearch(agent.name.toLowerCase(), filter!),
		)
	}, [data, filter])

	return (
		<>
			<AddAgentForm
				open={dialogs.addAgent}
				onOpenChange={e => setDialogs('addAgent', e)}
			/>
			<div className='m-10 grid gap-6 rounded-md'>
				<div className='grid gap-2'>
					<h1 className='font-bold text-4xl'>Agents</h1>
					<h1 className='font-semibold text-primary/50'>
						Create and manage your agents.
					</h1>
				</div>

				{!data && conv_agents.isLoading && (
					<>
						<div className='flex items-center justify-between'>
							<div className='relative'>
								<Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search Agents...'
									disabled
									className='w-[400px] pl-8'
								/>
							</div>
							<Button disabled className='flex gap-2'>
								<PlusIcon />
								<p className='hidden lg:inline'>Create Agent</p>
							</Button>
						</div>

						<div className='rounded-lg border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='px-4'>Name</TableHead>
										<TableHead className='hidden items-center md:flex'>
											Description
										</TableHead>
										<TableHead>Tags</TableHead>
										<TableHead>Created</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{Array.from({ length: 5 }).map((_, index) => (
										<TableRow key={index}>
											<TableCell className='px-4'>
												<Skeleton className='h-4 w-[150px]' />
											</TableCell>
											<TableCell className='hidden items-center md:flex'>
												<Skeleton className='h-4 w-[250px]' />
											</TableCell>
											<TableCell>
												<div className='flex gap-1'>
													<Skeleton className='h-5 w-[60px] rounded-full' />
													<Skeleton className='h-5 w-[80px] rounded-full' />
													<Skeleton className='h-5 w-[70px] rounded-full' />
												</div>
											</TableCell>
											<TableCell>
												<Skeleton className='h-4 w-[100px]' />
											</TableCell>
											<TableCell>
												<Skeleton className='h-8 w-8 rounded-md' />
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</>
				)}

				{data && data?.length === 0 && !conv_agents.isLoading && (
					<div className='flex flex-col items-center justify-center rounded-lg px-4 py-16'>
						<div className='mb-4 rounded-full bg-muted/50 p-4'>
							<Bot className='h-10 w-10 text-muted-foreground' />
						</div>
						<h2 className='mb-2 font-semibold text-xl'>No agents found</h2>
						<p className='mb-8 max-w-md text-center text-muted-foreground'>
							You haven't created any agents yet. Add a new agent to get
							started.
						</p>

						<Button onClick={() => setDialogs('addAgent', true)}>
							<PlusIcon className='size-4' />
							Add Agent
						</Button>
					</div>
				)}

				{data && data.length > 0 && (
					<>
						<div className='flex items-center justify-between'>
							<div className='relative'>
								<Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search Agents...'
									onChange={e => setFilter(e.target.value)}
									className='w-[400px] pl-8'
								/>
							</div>

							<TooltipProvider>
								<Tooltip delayDuration={1000}>
									<TooltipTrigger>
										<Button
											className='flex gap-2'
											onClick={() => setDialogs('addAgent', true)}
										>
											<PlusIcon />
											<p className='hidden lg:inline'>Create Agent</p>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Add Agent</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>

						<div className='rounded-lg border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='px-4'>Name</TableHead>
										<TableHead className='hidden items-center md:flex'>
											Description
										</TableHead>
										<TableHead>Tags</TableHead>
										<TableHead>Created</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{agents?.map(agent => (
										<React.Fragment key={agent._id}>
											<WarnDialog
												title='Are you absolutely sure?'
												description='This action cannot be undone. This will permanently delete your agent and remove your data from our servers.'
												open={dialogs.warnDelete}
												onOpenChange={e => setDialogs('warnDelete', e)}
												onConfirm={async () => {
													await deleteAgent({ agentId: agent._id })
												}}
											/>
											<EditAgentForm
												open={dialogs.editAgent}
												onOpenChange={e => setDialogs('editAgent', e)}
												agentId={agent._id}
											/>
											<TableRow
												key={agent._id}
												className='cursor-pointer'
												onClick={() =>
													navigate({
														to: '/dashboard/agents/$agent/agent',
														params: { agent: agent.agentId },
													})
												}
											>
												<TableCell className='px-4 font-medium'>
													{agent.name}
												</TableCell>
												<TableCell className='hidden max-w-[300px] items-center truncate md:table-cell'>
													{agent.description}
												</TableCell>
												<TableCell>
													<div className='flex flex-wrap gap-1'>
														{agent.tags.slice(0, 3).map(tag => (
															<Badge
																key={tag}
																variant='secondary'
																className='text-xs'
															>
																<Tag className='mr-1 h-3 w-3' />
																{tag}
															</Badge>
														))}
														{agent.tags.length > 3 && (
															<Badge variant='outline' className='text-xs'>
																+{agent.tags.length - 3}
															</Badge>
														)}
													</div>
												</TableCell>
												<TableCell className='text-muted-foreground text-sm'>
													{format(agent._creationTime, 'MMM d, yyyy')}
												</TableCell>
												<TableCell onClick={e => e.stopPropagation()}>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant='ghost'
																size='icon'
																className='h-8 w-8'
															>
																<MoreHorizontal className='h-4 w-4' />
																<span className='sr-only'>Open menu</span>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align='end'>
															<DropdownMenuItem
																onClick={async () => {
																	await navigator.clipboard.writeText(
																		agent.agentId,
																	)
																	toast.success('Agent ID copied.')
																}}
															>
																<Copy className='mr-2 h-4 w-4' />
																Copy agent ID
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={async () => {
																	await navigator.clipboard.writeText(
																		`${window.location.host}/agents/${agent._id}`,
																	)
																	toast.success('Link copied.')
																}}
															>
																<LinkIcon className='mr-2 h-4 w-4' />
																Copy Link
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => setDialogs('editAgent', true)}
															>
																<PencilIcon className='mr-2 size-4' />
																Edit agent
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => setDialogs('warnDelete', true)}
																className='text-destructive'
															>
																<Trash2 className='mr-2 h-4 w-4' />
																Delete agent
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										</React.Fragment>
									))}
								</TableBody>
							</Table>
						</div>
					</>
				)}
			</div>
		</>
	)
}
