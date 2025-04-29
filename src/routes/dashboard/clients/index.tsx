import { useAuth } from '@/context/auth-context'
import { useConvex, useMutation, useQuery } from 'convex/react'
import { api } from 'convex/_generated/api'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Dialog } from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import * as z from 'zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { useMemo, useState, type PropsWithChildren } from 'react'
import {
	BotIcon,
	CheckIcon,
	DeleteIcon,
	Edit3Icon,
	EllipsisIcon,
	LoaderCircle,
	PlusIcon,
	Search,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { rabinKarpSearch } from '@/lib/utils'
import { useClientState } from '@/context/client-state-context'
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { Clients } from '@/lib/types'
import { useDialog } from '@/hooks/use-dialogs'
import { PasswordInput } from '@/components/ui/password-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Id } from 'convex/_generated/dataModel'

export const Route = createFileRoute('/dashboard/clients/')({
	component: RouteComponent,
})

function RouteComponent() {
	const auth = useAuth()

	const [filter, setFilter] = useState<string>()
	const { createClientDialog } = useClientState()

	const clients = useQuery(api.client.listClients, { id: auth.user!._id })

	const filteredClients = useMemo(() => {
		if (clients && (!filter || filter === '')) {
			return clients
		}
		return clients?.filter(client =>
			rabinKarpSearch(client.name.toLowerCase(), filter!),
		)
	}, [clients, filter])

	return (
		<div className='h-screen w-full'>
			<div className='grid grid-cols-1 m-20 gap-10'>
				<div className='grid gap-4'>
					<h1 className='text-4xl font-bold'>Clients</h1>
					<p className='font-semibold text-primary/50'>
						Create and manage clients.
					</p>
				</div>
				<div className='flex justify-between items-center'>
					<div className='relative'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Search Clients...'
							onChange={e => setFilter(e.target.value)}
							className='pl-8 w-[400px]'
						/>
					</div>
					<Button
						className='flex gap-2'
						variant='outline'
						size='sm'
						onClick={() => createClientDialog.setState(true)}
					>
						<PlusIcon /> <p className='hidden md:block'>Create Client</p>
					</Button>
				</div>
				{clients && clients.length === 0 && (
					<div className='flex justify-center items-center h-40'>
						<p className='text-primary/50'>You have no clients.</p>
					</div>
				)}
				{clients && clients.length !== 0 && (
					<Table>
						<TableCaption className='text-primary/30'>
							A list of your agents.
						</TableCaption>
						<TableHeader className='bg-muted/40 h-[50px]'>
							<TableRow>
								<TableHead className='pl-6'>Name</TableHead>
								<TableHead>Username</TableHead>
								<TableHead>Created At</TableHead>
								<TableHead className='text-right pr-6'>Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredClients &&
								filteredClients.map(client => (
									<TableRow
										key={client._id}
										className='h-[50px] cursor-pointer'
									>
										<TableCell className='pl-6'>{client.name}</TableCell>
										<TableCell>{client.username}</TableCell>
										<TableCell>
											{new Date(client._creationTime).toLocaleDateString(
												'en-US',
												{
													day: 'numeric',
													month: 'long',
													year: 'numeric',
												},
											)}
										</TableCell>
										<TableCell className='text-right pr-6'>
											<ClientDropDownMenu client={client}>
												<Button size='icon' variant='ghost'>
													<EllipsisIcon className='size-5' />
												</Button>
											</ClientDropDownMenu>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	)
}

function ClientDropDownMenu({
	client,
	children,
}: { client: Clients[0] } & PropsWithChildren) {
	const auth = useAuth()
	const convex = useConvex()
	const agent_lists = useQuery(api.agents.getAgents, { userId: auth.user?._id })
	const updateClient = useMutation(api.client.updateClient)
	const assignAgent = useMutation(api.client.assignAgent)
	const [agentFilter, setAgentFilter] = useState<string>()
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

	const [dialogs, setDialogs] = useDialog({
		warnDelete: false,
		assignAgent: false,
		editClient: false,
	})
	const deleteClient = useMutation(api.client.deleteClient)
	const formSchema = z
		.object({
			client_name: z.string().min(2),
			username: z.string().min(2),
			email: z.string().optional(),
			password: z.string().min(2).optional(),
			confirm_password: z.string().min(2).optional(),
		})
		.superRefine(
			async ({ password, confirm_password, username, email }, ctx) => {
				const userExists = await convex.query(api.client.usernameExists, {
					username,
				})

				if (userExists) {
					ctx.addIssue({
						code: 'custom',
						message: 'username is already taken',
						path: ['username'],
					})
				}

				if (email) {
					const emailExists = await convex.query(api.client.emailExists, {
						email,
					})
					if (emailExists) {
						ctx.addIssue({
							code: 'custom',
							message: 'username is already taken',
							path: ['username'],
						})
					}
				}

				if (password !== confirm_password) {
					ctx.addIssue({
						code: 'custom',
						message: 'Password do not match',
						path: ['confirm_password'],
					})
				}
			},
		)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			client_name: client.name,
			username: client.username,
			email: client.email,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await updateClient({
				clientId: client._id,
				name: values.client_name,
				email: values.email === '' ? undefined : values.email,
				username: values.username,
				password: values.password,
			})
			form.reset({
				client_name: client.name,
				username: client.username,
				email: client.email,
				password: undefined,
				confirm_password: undefined,
			})
			await new Promise(res => setTimeout(res, 400))
			setDialogs('editClient', false)
			toast.success('Client Updated Successfully.')
		} catch (error) {
			toast.error('Failed to Update the Client. Please try again.')
		}
	}

	return (
		<>
			<Dialog
				open={dialogs.warnDelete}
				onOpenChange={e => setDialogs('warnDelete', e)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<div className='flex gap-4'>
							<Button
								type='submit'
								size='sm'
								variant='ghost'
								className='cursor-pointer'
								onClick={() => setDialogs('warnDelete', false)}
							>
								Cancel
							</Button>
							<Button
								type='submit'
								size='sm'
								className='cursor-pointer'
								onClick={async () => {
									await deleteClient({ clientId: client._id })
									toast.success('Client Deleted Successfully.')
									setDialogs('warnDelete', false)
								}}
							>
								Confirm
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog
				open={dialogs.warnDelete}
				onOpenChange={e => setDialogs('warnDelete', e)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<div className='flex gap-4'>
							<Button
								type='submit'
								size='sm'
								variant='ghost'
								className='cursor-pointer'
								onClick={() => setDialogs('warnDelete', false)}
							>
								Cancel
							</Button>
							<Button
								type='submit'
								size='sm'
								className='cursor-pointer'
								onClick={async () => {
									await deleteClient({ clientId: client._id })
									toast.success('Client Deleted Successfully.')
									setDialogs('warnDelete', false)
								}}
							>
								Confirm
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog
				open={dialogs.editClient}
				onOpenChange={e => setDialogs('editClient', e)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Client</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-8 py-2'
						>
							<FormField
								control={form.control}
								name='client_name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Client Name</FormLabel>
										<FormControl>
											<Input placeholder='client name' type='text' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='username'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Client's Login Id (case-sensitive)</FormLabel>
										<FormControl>
											<Input placeholder='shadcn' type='text' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Client Email (Optional)</FormLabel>
										<FormControl>
											<Input
												placeholder='user@example.com'
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
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<PasswordInput
												placeholder='Enter Client Password'
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='confirm_password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<PasswordInput
												placeholder='Re-Enter Your Password'
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='flex gap-4 justify-end'>
								<Button
									type='button'
									variant='ghost'
									className='cursor-pointer'
									onClick={() => setDialogs('editClient', false)}
								>
									cancel
								</Button>
								<Button
									type='submit'
									size='sm'
									disabled={
										!form.formState.isDirty || form.formState.isSubmitting
									}
									className='cursor-pointer'
								>
									{form.formState.isSubmitting ? (
										<LoaderCircle className='size-4' />
									) : (
										'save'
									)}
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={dialogs.assignAgent}
				onOpenChange={e => setDialogs('assignAgent', e)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Assign Agent</DialogTitle>
						<DialogDescription>Assign agents to the client.</DialogDescription>
					</DialogHeader>
					<div>
						{agent_lists && (
							<div className='grid gap-6'>
								<div className='relative'>
									<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
									<Input
										placeholder='Search agents...'
										value={agentFilter}
										onChange={e => setAgentFilter(e.target.value)}
										className='pl-8'
									/>
								</div>
								<ScrollArea className='h-[300px] rounded-md border'>
									<div
										className={`p-2 grid gap-2 ${filteredAgents && filteredAgents.length === 0 ? 'flex justify-center items-center h-[300px]' : ''}`}
									>
										{filteredAgents && (
											<>
												{filteredAgents.length === 0 ? (
													<div className='p-4 text-center text-sm text-muted-foreground'>
														No agents found.
													</div>
												) : (
													filteredAgents.map(agent => (
														<div
															key={agent._id}
															className={`flex items-center justify-between rounded-md p-2 hover:bg-muted`}
															onClick={() =>
																setAssignedAgents(prev =>
																	prev.includes(agent._id)
																		? prev.filter(a => a !== agent._id)
																		: [...prev, agent._id],
																)
															}
														>
															<div className='flex items-center gap-3'>
																<div>
																	<p className='text-sm font-medium'>
																		{agent.name}
																	</p>
																	<p className='text-xs text-muted-foreground'>
																		{agent.description}
																	</p>
																	<div className='flex items-center mt-4 gap-2'>
																		{agent.tags.map(tag => (
																			<Badge className='text-xs'>{tag}</Badge>
																		))}
																	</div>
																</div>
															</div>
															{assignedAgents.includes(agent._id) && (
																<CheckIcon className='size-5 mr-3' />
															)}
														</div>
													))
												)}
											</>
										)}
									</div>
								</ScrollArea>
								<div className='flex justify-end items-center gap-4'>
									<Button
										size='sm'
										variant='ghost'
										onClick={() => setDialogs('assignAgent', false)}
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
											setDialogs('assignAgent', false)
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
			<DropdownMenu key={client._id}>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent className='w-[230px]'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={() => setDialogs('editClient', true)}>
							Client Information
							<DropdownMenuShortcut>
								<Edit3Icon />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setDialogs('assignAgent', true)}>
							Assign Agent
							<DropdownMenuShortcut>
								<BotIcon />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => setDialogs('warnDelete', true)}>
						Delete client
						<DropdownMenuShortcut>
							<DeleteIcon className='size-4' />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
