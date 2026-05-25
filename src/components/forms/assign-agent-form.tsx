import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { CheckIcon, Search, Tag } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useQuery } from '@/cache/useQuery'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/context/auth-context'
import type { Clients } from '@/lib/types'
import { rabinKarpSearch } from '@/lib/utils'

interface Props {
	open: boolean
	onOpenChange: (e: boolean) => void
	client: Clients[0]
}

export function AssignAgentForm({ client, open, onOpenChange }: Props) {
	const auth = useAuth()
	const agent_lists = useQuery(api.agents.getAgents, {
		userId: auth.user?._id,
	})
	const [agentFilter, setAgentFilter] = useState<string>()
	const assignAgent = useMutation(api.client.assignAgent)
	const [assignedAgents, setAssignedAgents] = useState<Id<'agent'>[]>(
		client.assigned_Agents,
	)
	const filteredAgents = useMemo(() => {
		if (!agentFilter || agentFilter === '') {
			return agent_lists
		}
		return agent_lists?.filter(agent =>
			rabinKarpSearch(agent.name.toLowerCase(), agentFilter!),
		)
	}, [agentFilter, agent_lists])

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Assign Agent</DialogTitle>
					<DialogDescription>Assign agents to the client.</DialogDescription>
				</DialogHeader>
				<div>
					{agent_lists && (
						<div className='grid gap-6'>
							<div className='relative'>
								<Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search agents...'
									value={agentFilter}
									onChange={e => setAgentFilter(e.target.value)}
									className='pl-8'
								/>
							</div>
							<ScrollArea className='h-[300px] rounded-md border'>
								<div
									className={`grid gap-2 p-2 ${filteredAgents && filteredAgents.length === 0 && 'flex h-[300px] items-center justify-center'}`}
								>
									{filteredAgents &&
										(filteredAgents.length === 0 ? (
											<div className='p-4 text-center text-muted-foreground text-sm'>
												No agents found.
											</div>
										) : (
											filteredAgents.map(agent => (
												<button
													type='button'
													key={agent._id}
													className='flex w-full flex-col rounded-lg p-2 hover:bg-muted'
													onClick={() =>
														setAssignedAgents(prev =>
															prev.includes(agent._id)
																? prev.filter(a => a !== agent._id)
																: [...prev, agent._id],
														)
													}
												>
													<div className='flex w-full items-center justify-between'>
														<span className='font-medium'>{agent.name}</span>
														{assignedAgents.includes(agent._id) && (
															<CheckIcon className='mr-3 size-5' />
														)}
													</div>
													<p className='line-clamp-1 text-left text-muted-foreground text-xs'>
														{agent.description}
													</p>
													{agent.tags.length > 0 && (
														<div className='mt-1 flex flex-wrap gap-1'>
															{agent.tags.map(tag => (
																<Badge
																	key={tag}
																	variant='secondary'
																	className='text-xs'
																>
																	<Tag className='mr-1 h-3 w-3' />
																	{tag}
																</Badge>
															))}
														</div>
													)}
												</button>
											))
										))}
								</div>
							</ScrollArea>
							<div className='flex items-center justify-end gap-4'>
								<Button
									size='sm'
									variant='ghost'
									onClick={() => onOpenChange(false)}
								>
									cancel
								</Button>
								<Button
									size='sm'
									disabled={client.assigned_Agents.equals(assignedAgents)}
									onClick={async () => {
										await assignAgent({
											clientId: client._id,
											agents: assignedAgents,
										})
										onOpenChange(false)
									}}
								>
									Assign
								</Button>
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
