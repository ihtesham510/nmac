import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { PasswordInput } from '@/components/ui/password-input'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	CopyIcon,
	EllipsisVertical,
	Phone,
	PhoneIcon,
	PlusIcon,
	TrashIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Table,
	TableCaption,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table'
import type { GetPhoneNumberResponseModel } from 'elevenlabs/api'
import { useQuery } from '@tanstack/react-query'
import { queries } from '@/api/query-options'
import { useAgents } from '@/hooks/use-agents'
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { useElevenLabsClient } from '@/api/client'
import { useAddPhoneNo } from '@/hooks/use-add-phone-no'
import { useDialog } from '@/hooks/use-dialogs'
import { useAuth } from '@/context/auth-context'
import { AgentSelect } from '@/components/select-agent'
import type { Agent } from '@/lib/types'
import React, { useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Route = createFileRoute('/dashboard/phone/')({
	component: RouteComponent,
})

function RouteComponent() {
	const [dialog, setDialog] = useDialog({ sheet: false })
	const agents = useAgents()
	const client = useElevenLabsClient()
	const auth = useAuth()
	const isClient = auth.isAuthenticated && auth.type === 'client'
	const phoneNos = useQuery(
		queries.list_phone_no(client, {
			filter: isClient ? agents.map(agent => agent.agentId) : undefined,
		}),
	)
	return (
		<Sheet open={dialog.sheet} onOpenChange={e => setDialog('sheet', e)}>
			<SheetForm isClient={isClient} />
			<div className='m-10 grid space-y-6'>
				<div className='flex items-center justify-between mb-6'>
					<div className='grid gap-2'>
						<h1 className='text-4xl font-bold'>Phone Numbers</h1>
						<p className='font-semibold text-primary/50'>
							Import and manage your phone numbers.
						</p>
					</div>
					<SheetTrigger>
						<Button>
							<PlusIcon className='h-4 w-4 mr-2' />
							Import Number
						</Button>
					</SheetTrigger>
				</div>
				{phoneNos.data && (
					<PhoneNumbersTable
						phoneNos={phoneNos.data}
						onAddPhoneClick={() => setDialog('sheet', true)}
					/>
				)}
			</div>
		</Sheet>
	)
}

function PhoneNumbersTable({
	phoneNos,
	onAddPhoneClick,
}: {
	phoneNos: GetPhoneNumberResponseModel[]
	onAddPhoneClick: () => void
}) {
	const navigate = useNavigate()
	return (
		<>
			{phoneNos.length !== 0 && (
				<Table>
					<TableCaption>A list of your phone numbers.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Label</TableHead>
							<TableHead>Phone No.</TableHead>
							<TableHead>Assigned Agent</TableHead>
							<TableHead>Provider</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className='mt-2'>
						{phoneNos.map(phoneNo => (
							<TableRow
								className='h-14'
								onClick={() =>
									navigate({
										to: '/dashboard/phone/$id',
										params: { id: phoneNo.phone_number_id },
									})
								}
							>
								<TableCell>{phoneNo.label}</TableCell>
								<TableCell className='font-medium'>
									{phoneNo.phone_number}
								</TableCell>
								<TableCell>
									{phoneNo.assigned_agent ? (
										phoneNo.assigned_agent.agent_name
									) : (
										<Badge variant='outline'>No Assigned Agent</Badge>
									)}
								</TableCell>
								<TableCell>
									<Badge
										variant='outline'
										className={getProviderBadgeColor(phoneNo.provider)}
									>
										{phoneNo.provider}
									</Badge>
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger>
											<Button variant='ghost' size='icon'>
												<EllipsisVertical className='size-4' />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuItem
												className='flex gap-2'
												onClick={async e => {
													e.stopPropagation()
													await window.navigator.clipboard.writeText(
														phoneNo.phone_number,
													)
													toast.success('Nubmer Copied To Clipboard')
												}}
											>
												<CopyIcon className='size-4' />{' '}
												<p>Copy Phone Number</p>{' '}
											</DropdownMenuItem>
											<DropdownMenuItem className='flex gap-2'>
												<TrashIcon className='size-4' />{' '}
												<p>Delete Nubmer</p>{' '}
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
			{phoneNos.length === 0 && (
				<div className='flex flex-col items-center justify-center py-16 px-4 rounded-lg bg-primary-foreground mt-4'>
					<div className='bg-muted/50 p-4 rounded-full mb-4'>
						<Phone className='h-10 w-10 text-muted-foreground' />
					</div>
					<h2 className='text-xl font-semibold mb-2'>No phone numbers found</h2>
					<p className='text-muted-foreground text-center max-w-md mb-8'>
						You haven't added any phone numbers yet. Import phone numbers to get
						started.
					</p>
					<Button size='lg' className='gap-2' onClick={onAddPhoneClick}>
						<PlusIcon className='h-5 w-5' />
						Import Number
					</Button>
				</div>
			)}
		</>
	)
}

function SheetForm({ isClient }: { isClient: boolean }) {
	const addPhoneNo = useAddPhoneNo()
	const agents = useAgents()
	const [selectedAgent, setSelectedAgent] = React.useState<Agent>(agents[0])
	const formSchema = z.object({
		label: z.string().min(1),
		phone_no: z
			.string()
			.refine(isValidPhoneNumber, { message: 'Invalid Phone No.' }),
		sid: z.string(),
		token: z.string(),
		agent_id: z.string().optional(),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})
	useEffect(() => {
		if (selectedAgent && isClient) {
			form.setValue('agent_id', selectedAgent._id)
		}
	}, [selectedAgent])

	async function onSubmit({
		phone_no,
		label,
		sid,
		token,
	}: z.infer<typeof formSchema>) {
		await addPhoneNo.mutateAsync({
			phone_number: phone_no,
			label,
			sid,
			token,
			agentId: selectedAgent?.agentId,
		})
	}

	return (
		<SheetContent>
			<SheetHeader>
				<SheetTitle className='flex items-center gap-2'>
					<Button variant='outline' size='icon'>
						<PhoneIcon className='size-4' />
					</Button>
					Import Phone Number from Twilio.
				</SheetTitle>
			</SheetHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<ScrollArea scrollBar='hidden' className='mx-4 my-2 px-1 h-[68vh]'>
						<div className='space-y-8 '>
							{isClient && (
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
							)}
							<FormField
								control={form.control}
								name='label'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Label</FormLabel>
										<FormControl>
											<Input
												placeholder='Your Phone No Label'
												type='text'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='phone_no'
								render={({ field }) => (
									<FormItem className='flex flex-col items-start'>
										<FormLabel>Phone Number</FormLabel>
										<FormControl className='w-full'>
											<PhoneInput
												placeholder='Your Phone Number'
												{...field}
												defaultCountry='TR'
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='sid'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Twilio Sid</FormLabel>
										<FormControl>
											<PasswordInput
												placeholder='Your SID'
												type='text'
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='token'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Token</FormLabel>
										<FormControl>
											<PasswordInput
												placeholder='Twilio Token'
												type='text'
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</ScrollArea>
					<SheetFooter>
						<Button type='submit' className='w-full'>
							Add
						</Button>
					</SheetFooter>
				</form>
			</Form>
		</SheetContent>
	)
}

function getProviderBadgeColor(provider: string) {
	switch (provider.toLowerCase()) {
		case 'twilio':
			return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
		case 'sip_trunk':
			return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20'
		default:
			return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
	}
}
