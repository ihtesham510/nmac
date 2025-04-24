import { queries } from '@/api/query-options'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { EllipsisIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMemo, useState } from 'react'
import { mutations } from '@/api/mutation-options'
import { Input } from '@/components/ui/input'
import { rabinKarpSearch } from '@/lib/utils'
import { toast } from 'sonner'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

export const Route = createFileRoute('/dashboard/agents/')({
	component: RouteComponent,
})

function RouteComponent() {
	const { data } = useQuery(queries.list_agents())
	const queryClient = useQueryClient()
	const deleteAgent = useMutation(mutations.delete_agent(queryClient))
	const createAgent = useMutation(mutations.create_agent(queryClient))
	const navigate = useNavigate()
	const [filter, setFilter] = useState<string>()

	const agents = useMemo(() => {
		if (data && (!filter || filter === '')) {
			return data.agents
		}
		return data?.agents.filter(agent =>
			rabinKarpSearch(agent.name.toLowerCase(), filter!),
		)
	}, [data, filter])

	return (
		<div className='m-20 rounded-md gap-10 grid'>
			<div className='grid gap-2'>
				<h1 className='text-4xl font-bold'>Agents</h1>
				<h1 className='text-lg font-bold text-primary/30'>
					Create and manage your agents.
				</h1>
			</div>
			<div className='flex justify-between items-center'>
				<Input
					placeholder='Search Agents ...'
					value={filter}
					className='w-[400px]'
					onChange={e => setFilter(e.target.value)}
				/>
				<TooltipProvider>
					<Tooltip delayDuration={1000}>
						<TooltipTrigger>
							<Button
								className='flex gap-2'
								onClick={() => {
									createAgent.mutate({
										options: {
											name: 'untitled agent',
											conversation_config: {},
										},
									})
									if (createAgent.error) {
										toast.error('Error While Creating and agent')
									}
								}}
							>
								<PlusIcon />
								<p className='hidden lg:inline'>Create Agent</p>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Create Agent</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<Table>
				<TableCaption className='text-primary/30'>
					A list of your agents.
				</TableCaption>
				<TableHeader className='bg-muted/40 h-[50px]'>
					<TableRow>
						<TableHead className='w-[300px] pl-6'>Name</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead className='text-right'>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{agents &&
						agents.map(agent => (
							<DropdownMenu>
								<TableRow
									key={agent.agent_id}
									className='h-[50px] cursor-pointer'
									onClick={() =>
										navigate({
											to: '/dashboard/agents/$agent_id',
											params: { agent_id: agent.agent_id },
										})
									}
								>
									<TableCell className='pl-6'>{agent.name}</TableCell>
									<TableCell>
										{new Date(
											agent.created_at_unix_secs * 1000,
										).toLocaleDateString('en-US', {
											day: 'numeric',
											month: 'long',
											year: 'numeric',
										})}
									</TableCell>
									<TableCell className='text-right'>
										<DropdownMenuTrigger>
											<Button size='icon' variant='ghost'>
												<EllipsisIcon className='size-5' />
											</Button>
										</DropdownMenuTrigger>
									</TableCell>
								</TableRow>
								<DropdownMenuContent>
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() =>
											deleteAgent.mutate({ agent_id: agent.agent_id })
										}
									>
										Delete Agent
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={async () => {
											await navigator.clipboard.writeText(agent.agent_id)
											toast.success('Copied to Clipboard')
										}}
									>
										Copy Agent Id
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						))}
				</TableBody>
			</Table>
		</div>
	)
}
