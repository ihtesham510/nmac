import * as React from 'react'
import { Check, ChevronsUpDown, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import type { Agent } from '@/lib/types'

interface AgentSelectProps {
	agents: Agent[]
	value: Agent
	onSelect: (agent: Agent) => void
	placeholder?: string
	className?: string
}

export function AgentSelect({
	agents,
	value,
	onSelect,
	placeholder = 'Select an agent...',
	className,
}: AgentSelectProps) {
	const [open, setOpen] = React.useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className={cn('w-full justify-between', className)}
				>
					{value ? value.name : placeholder}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[300px] p-0' align='start'>
				<Command>
					<CommandInput placeholder='Search agents...' />
					<CommandEmpty>No agent found.</CommandEmpty>
					<CommandList>
						<CommandGroup>
							{agents.map(agent => {
								if (agent)
									return (
										<CommandItem
											key={agent._id}
											value={agent.name}
											onSelect={() => {
												onSelect(agent)
												setOpen(false)
											}}
											className='flex flex-col items-start'
										>
											<div className='flex w-full items-center justify-between'>
												<span className='font-medium'>{agent.name}</span>
												{value?._id === agent._id && (
													<Check className='h-4 w-4' />
												)}
											</div>
											<p className='text-xs text-muted-foreground line-clamp-1 text-left'>
												{agent.description}
											</p>
											{agent.tags.length > 0 && (
												<div className='flex flex-wrap gap-1 mt-1'>
													{agent.tags.map(tag => (
														<Badge
															key={tag}
															variant='secondary'
															className='text-xs'
														>
															<Tag className='h-3 w-3 mr-1' />
															{tag}
														</Badge>
													))}
												</div>
											)}
										</CommandItem>
									)
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
