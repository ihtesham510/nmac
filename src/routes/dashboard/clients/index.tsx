import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useMutation } from 'convex/react'
import {
	BotIcon,
	Calendar,
	CreditCard,
	DeleteIcon,
	Edit3Icon,
	MoreHorizontal,
	PlusIcon,
	Search,
	UserIcon,
} from 'lucide-react'
import { type PropsWithChildren, useMemo, useState } from 'react'
import { useQuery } from '@/cache/useQuery'
import { CreateClientForm } from '@/components/create-client-form'
import { AssignAgentForm } from '@/components/forms/assign-agent-form'
import { EditClientForm } from '@/components/forms/edit-client-form'
import { ManageSubscriptionForm } from '@/components/forms/manage-subscription-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { SubscriptionHoverCard } from '@/components/utils/subscription-hover-card'
import { WarnDialog } from '@/components/utils/warn-dialog'
import { useAuth } from '@/context/auth-context'
import { useDialog } from '@/hooks/use-dialogs'
import type { Clients } from '@/lib/types'
import { getSubscriptionBadgeClasses, rabinKarpSearch } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/clients/')({
	component: RouteComponent,
})

function RouteComponent() {
	const auth = useAuth()
	const [filter, setFilter] = useState<string>()
	const [dialogs, setDialogs] = useDialog({
		createClient: false,
	})

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
		<div className='m-10 grid space-y-6'>
			<div className='grid gap-2'>
				<h1 className='font-bold text-4xl'>Clients</h1>
				<h1 className='font-semibold text-primary/50'>
					Create and manage your clients.
				</h1>
			</div>

			{!clients && (
				<>
					<div className='flex items-center justify-between'>
						<div className='relative flex items-center'>
							<div className='relative'>
								<Skeleton className='h-10 w-[400px] rounded-md' />
								<Skeleton className='absolute top-2.5 left-2 h-4 w-4 rounded-sm' />
							</div>
						</div>
						<div className='flex items-center'>
							<Skeleton className='h-10 w-10 rounded-md lg:w-[140px]' />
						</div>
					</div>

					<div className='rounded-lg border'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='px-4'>Name</TableHead>
									<TableHead className='hidden md:table-cell'>
										Username
									</TableHead>
									<TableHead className='hidden lg:table-cell'>
										Subscription
									</TableHead>
									<TableHead className='hidden sm:table-cell'>
										Created
									</TableHead>
									<TableHead className='w-10' />
								</TableRow>
							</TableHeader>
							<TableBody>
								{Array.from({ length: 5 }).map((_, index) => (
									<TableRow key={index}>
										<TableCell className='px-4'>
											<Skeleton className='h-4 w-[150px]' />
										</TableCell>
										<TableCell className='hidden md:table-cell'>
											<Skeleton className='h-4 w-[100px]' />
										</TableCell>
										<TableCell className='hidden lg:table-cell'>
											<Skeleton className='h-5 w-[80px] rounded-full' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-5 w-[60px] rounded-full' />
										</TableCell>
										<TableCell className='hidden sm:table-cell'>
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

			{clients && clients.length === 0 && (
				<div className='flex flex-col items-center justify-center rounded-lg px-4 py-16'>
					<div className='mb-4 rounded-full bg-muted/50 p-4'>
						<UserIcon className='h-10 w-10 text-muted-foreground' />
					</div>
					<h2 className='mb-2 font-semibold text-xl'>No clients found</h2>
					<p className='mb-8 max-w-md text-center text-muted-foreground'>
						You haven't created any clients yet. Add a new client to get
						started.
					</p>
					<Button onClick={() => setDialogs('createClient', true)}>
						<PlusIcon className='size-4' />
						Add Client
					</Button>
				</div>
			)}

			<CreateClientForm
				open={dialogs.createClient}
				onOpenChange={e => setDialogs('createClient', e)}
			/>

			{clients && clients.length > 0 && (
				<>
					<div className='flex items-center justify-between'>
						<div className='relative'>
							<Search className='absolute top-2.5 left-2 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Search Clients...'
								onChange={e => setFilter(e.target.value)}
								className='w-[400px] pl-8'
							/>
						</div>
						<TooltipProvider>
							<Tooltip delayDuration={1000}>
								<TooltipTrigger>
									<Button
										className='flex gap-2'
										onClick={() => setDialogs('createClient', true)}
									>
										<PlusIcon />
										<p className='hidden lg:inline'>Create Client</p>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Add Client</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					<div className='rounded-lg border'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='px-4'>Name</TableHead>
									<TableHead className='hidden md:table-cell'>
										Username
									</TableHead>
									<TableHead className='hidden lg:table-cell'>
										Subscription
									</TableHead>
									<TableHead className='hidden sm:table-cell'>
										Created
									</TableHead>
									<TableHead className='w-10' />
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredClients?.map(client => (
									<TableRow key={client._id} className='cursor-pointer'>
										<TableCell className='px-4 font-medium'>
											{client.name}
										</TableCell>
										<TableCell className='hidden max-w-[300px] truncate md:table-cell'>
											{client.username}
										</TableCell>
										{client.subscription ? (
											<TableCell className='hidden lg:table-cell'>
												<SubscriptionHoverCard
													subscription={client.subscription}
													align='center'
													side='right'
												>
													<Badge
														className={`w-fit text-xs capitalize ${getSubscriptionBadgeClasses(client.subscription.type)}`}
													>
														{client.subscription.type}
													</Badge>
												</SubscriptionHoverCard>
											</TableCell>
										) : (
											<TableCell>
												<Badge variant='outline' className='text-xs'>
													No subscription
												</Badge>
											</TableCell>
										)}
										<TableCell className='hidden text-muted-foreground text-sm sm:table-cell'>
											<div className='flex items-center gap-1'>
												<Calendar className='h-3 w-3' />
												{new Date(client._creationTime).toLocaleDateString(
													'en-US',
													{
														day: 'numeric',
														month: 'short',
														year: 'numeric',
													},
												)}
											</div>
										</TableCell>
										<TableCell onClick={e => e.stopPropagation()}>
											<ClientDropDownMenu client={client}>
												<Button variant='ghost' size='icon' className='h-8 w-8'>
													<MoreHorizontal className='h-4 w-4' />
													<span className='sr-only'>Open menu</span>
												</Button>
											</ClientDropDownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</>
			)}
		</div>
	)
}

function ClientDropDownMenu({
	client,
	children,
}: { client: Clients[0] } & PropsWithChildren) {
	const [dialogs, setDialogs] = useDialog({
		warnDelete: false,
		assignAgent: false,
		editClient: false,
		manageSubscription: false,
	})
	const deleteClient = useMutation(api.client.deleteClient)

	return (
		<>
			<WarnDialog
				open={dialogs.warnDelete}
				onOpenChange={e => setDialogs('warnDelete', e)}
				title='Are you absolutely sure?'
				description='This action cannot be undone. This will permanently delete your client and remove your data from our servers.'
				onConfirm={async () => {
					await deleteClient({ clientId: client._id })
				}}
				itemName='client'
			/>

			<ManageSubscriptionForm
				open={dialogs.manageSubscription}
				onOpenChange={e => setDialogs('manageSubscription', e)}
				client={client}
			/>

			<EditClientForm
				open={dialogs.editClient}
				onOpenChange={e => setDialogs('editClient', e)}
				client={client}
			/>

			<AssignAgentForm
				open={dialogs.assignAgent}
				onOpenChange={e => setDialogs('assignAgent', e)}
				client={client}
			/>
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
						<DropdownMenuItem
							onClick={() => setDialogs('manageSubscription', true)}
						>
							Manage Subscription
							<DropdownMenuShortcut>
								<CreditCard />
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
