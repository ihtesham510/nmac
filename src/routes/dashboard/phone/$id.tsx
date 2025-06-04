import { useElevenLabsClient } from '@/api/client'
import { queries } from '@/api/query-options'
import React, { useEffect } from 'react'
import { type Agent } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { PhoneInput } from '@/components/ui/phone-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { useAgents } from '@/hooks/use-agents'
import { AgentSelect } from '@/components/select-agent'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { useDialog } from '@/hooks/use-dialogs'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { LoaderCircle, PhoneOutgoingIcon, TriangleAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { SelectSetting } from '@/components/project-settings/select-setting'

export const Route = createFileRoute('/dashboard/phone/$id')({
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams()
	const client = useElevenLabsClient()
	const [dialogs, setDialogs] = useDialog({
		makeCall: false,
	})
	const phone_number = useQuery(queries.get_phone_no(client, id))
	if (phone_number.isError) {
		return <Navigate to='/dashboard/404' replace />
	}
	return (
		<>
			{phone_number.isLoading && <PhoneSkeleton />}
			{phone_number.data && !phone_number.isLoading && (
				<React.Fragment>
					<MakeCallDialog
						open={dialogs.makeCall}
						onOpenChange={e => setDialogs('makeCall', e)}
						id={phone_number.data.phone_number_id}
					/>
					<div className='m-10 md:my-10 md:mx-40 grid space-y-6'>
						<div className='flex items-center justify-between mb-6'>
							<div className='grid gap-1'>
								<h1
									className='text-4xl font-bold cursor-pointer select-none'
									onClick={async () => {
										await window.navigator.clipboard.writeText(
											phone_number.data.phone_number,
										)
										toast.success('Phone Number Copied')
									}}
								>
									{phone_number.data.phone_number}
								</h1>
								<p className='font-semibold ml-2 text-primary/50'>
									{phone_number.data.label}
								</p>
								<p
									className='font-semibold text-primary/50 cursor-pointer ml-2 select-none'
									onClick={async () => {
										await window.navigator.clipboard.writeText(
											phone_number.data.phone_number_id,
										)

										toast.success('ID Copied')
									}}
								>
									{phone_number.data.phone_number_id}
								</p>
							</div>
							<Button onClick={() => setDialogs('makeCall', true)}>
								<PhoneOutgoingIcon className='h-4 w-4 mr-2' />
								Make Call
							</Button>
						</div>
						<SelectInbountCallAgent
							id={phone_number.data.assigned_agent?.agent_id}
							phone_id={phone_number.data.phone_number_id}
						/>
					</div>
				</React.Fragment>
			)}
		</>
	)
}

function SelectInbountCallAgent({
	id,
	phone_id,
}: {
	id?: string
	phone_id: string
}) {
	const queryClient = useQueryClient()
	const client = useElevenLabsClient()
	const formSchema = z.object({
		agent_id: z.string().optional(),
	})
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			agent_id: id,
		},
	})

	const agents = useAgents()
	const getDefaultAgent = (): Agent | undefined => {
		let index = agents.findIndex(agent => agent.agentId === id)
		return agents[index]
	}
	const [selectedAgent, setSelectedAgent] = React.useState<Agent | undefined>(
		getDefaultAgent(),
	)

	useEffect(() => {
		if (selectedAgent)
			form.setValue('agent_id', selectedAgent.agentId, { shouldDirty: true })
	}, [selectedAgent])

	async function onSubmit({ agent_id }: z.infer<typeof formSchema>) {
		try {
			await client.conversationalAi.updatePhoneNumber(phone_id, {
				agent_id,
			})
			await queryClient.invalidateQueries({
				queryKey: ['get_phone_no', phone_id],
			})
			form.reset({ agent_id })
			toast.success('Phone Number Updated')
		} catch (err) {
			console.error(err)
			toast.success('Error While updating phone number')
		}
	}

	return (
		<div>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<SelectSetting
					title='Inbound calls'
					description='Assign an agent to handle calls to this phone number.'
					className='w-full'
				>
					<AgentSelect
						agents={agents}
						value={selectedAgent ?? null}
						className='min-w-full'
						placeholder='Select Agent'
						onSelect={agent => setSelectedAgent(agent!)}
					/>
				</SelectSetting>
				{form.formState.isDirty && (
					<div className='sticky bg-background p-4 border-border border rounded-lg w-full bottom-6 flex justify-between items-center'>
						<div className='flex gap-2'>
							<TriangleAlert className='size-4' />
							<p className='font-semibold text-sm'>Changes Detected</p>
						</div>
						<div className='flex gap-2'>
							<Button
								className='text-sm font-semibold'
								variant='ghost'
								type='reset'
								size='sm'
								onClick={() => form.reset()}
							>
								clear
							</Button>
							<Button type='submit' className='text-sm font-semibold' size='sm'>
								{form.formState.isSubmitting ? (
									<LoaderCircle className='size-4 m-1 animate-spin' />
								) : (
									'save'
								)}
							</Button>
						</div>
					</div>
				)}
			</form>
		</div>
	)
}

function MakeCallDialog({
	open,
	onOpenChange,
	id,
}: {
	open?: boolean
	onOpenChange?: (e: boolean) => void
	id: string
}) {
	const client = useElevenLabsClient()
	const formSchema = z.object({
		agent_id: z.string(),
		phone_number: z
			.string()
			.refine(isValidPhoneNumber, { message: 'Invalid phone number.' }),
	})
	const agents = useAgents()
	const [selectedAgent, setSelectedAgent] = React.useState<Agent>(agents[0])
	const form = useForm({
		resolver: zodResolver(formSchema),
	})
	useEffect(() => {
		if (selectedAgent) {
			form.setValue('agent_id', selectedAgent.agentId)
		}
	}, [selectedAgent])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await client.conversationalAi.twilioOutboundCall({
				agent_id: values.agent_id,
				agent_phone_number_id: id,
				to_number: values.phone_number,
			})
			toast.success('Call Initialized Successfully')
		} catch (err) {
			console.error(err)
			toast.error('Error while making a call')
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-4'>
						<Button variant='secondary'>
							<PhoneOutgoingIcon className='size-4' />
						</Button>
						Make Call
					</DialogTitle>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className='space-y-4 my-4'>
								<FormField
									control={form.control}
									name='agent_id'
									render={() => (
										<FormItem>
											<FormLabel>Agent</FormLabel>
											<FormControl>
												<AgentSelect
													agents={agents}
													value={selectedAgent}
													className='min-w-full'
													placeholder='Select Agent'
													onSelect={agent => setSelectedAgent(agent!)}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='phone_number'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Number</FormLabel>
											<FormControl>
												<PhoneInput
													defaultCountry='AU'
													placeholder='Enter your phone number'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<DialogFooter>
								<Button type='submit' disabled={form.formState.isSubmitting}>
									{form.formState.isSubmitting ? (
										<LoaderCircle className='size-4 animate-spin' />
									) : (
										'Call'
									)}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

function PhoneSkeleton() {
	return (
		<div className='m-10 md:my-10 md:mx-40 grid space-y-6'>
			<div className='flex items-center justify-between mb-6'>
				<div className='grid gap-1'>
					<Skeleton className='h-8 w-8 mb-2' /> {/* Back button */}
					<Skeleton className='h-5 w-32 ml-2' /> {/* Phone number ID */}
					<Skeleton className='h-5 w-24 ml-2' /> {/* Label */}
					<Skeleton className='h-10 w-48' /> {/* Phone number */}
				</div>
				<Skeleton className='h-10 w-28' /> {/* Make Call button */}
			</div>
			{/* Inbound call agent select section skeleton */}
			<div className='space-y-4'>
				<div className='grid gap-2'>
					<Skeleton className='h-6 w-32' /> {/* "Inbound calls" title */}
					<Skeleton className='h-4 w-64' /> {/* Description */}
					<Skeleton className='h-10 w-full' /> {/* Agent select */}
				</div>
			</div>
		</div>
	)
}
