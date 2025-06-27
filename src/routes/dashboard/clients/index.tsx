import { useAuth } from '@/context/auth-context'
import { useMutation } from 'convex/react'
import { useQuery } from '@/cache/useQuery'
import { api } from 'convex/_generated/api'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
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
import { useMemo, useState, type PropsWithChildren } from 'react'
import {
	BotIcon,
	DeleteIcon,
	Edit3Icon,
	MoreHorizontal,
	PlusIcon,
	Search,
	UserIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { rabinKarpSearch } from '@/lib/utils'
import type { Clients } from '@/lib/types'
import { useDialog } from '@/hooks/use-dialogs'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { AssignAgentForm } from '@/components/forms/assign-agent-form'
import { EditClientForm } from '@/components/forms/edit-client-form'
import { WarnDialog } from '@/components/utils/warn-dialog'
import { CreateClientForm } from '@/components/create-client-form'

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
		<div className='m-10 space-y-6 grid'>
			<div className='grid gap-2'>
				<h1 className='text-4xl font-bold'>Clients</h1>
				<h1 className='font-semibold text-primary/50'>
					Create and manage your clients.
				</h1>
			</div>

			{!clients && (
				<>
					<div className='flex justify-between items-center'>
						<div className='relative flex items-center'>
							<div className='relative'>
								<Skeleton className='h-10 w-[400px] rounded-md' />
								<Skeleton className='absolute left-2 top-2.5 h-4 w-4 rounded-sm' />
							</div>
						</div>
						<div className='flex items-center'>
							<Skeleton className='h-10 w-10 lg:w-[140px] rounded-md' />
						</div>
					</div>

					<div className='border rounded-lg'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='px-4'>Name</TableHead>
									<TableHead className='hidden md:flex items-center'>
										Username
									</TableHead>
									<TableHead>Credits</TableHead>
									<TableHead>Created</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{Array.from({ length: 5 }).map((_, index) => (
									<TableRow key={index}>
										<TableCell className='px-4'>
											<Skeleton className='h-4 w-[150px]' />
										</TableCell>
										<TableCell className='hidden md:flex items-center'>
											<Skeleton className='h-4 w-[100px]' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-[60px]' />
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

			{clients && clients.length === 0 && (
				<div className='flex flex-col items-center justify-center py-16 px-4 rounded-lg'>
					<div className='bg-muted/50 p-4 rounded-full mb-4'>
						<UserIcon className='h-10 w-10 text-muted-foreground' />
					</div>
					<h2 className='text-xl font-semibold mb-2'>No clients found</h2>
					<p className='text-muted-foreground text-center max-w-md mb-8'>
						You haven't created any clients yet. Add a new client to get
						started.
					</p>
					<Button onClick={() => setDialogs('createClient', true)}>
						<PlusIcon className='size-4' />
						Add Client
					</Button>
				</div>
			)}

			{clients && clients.length > 0 && (
				<>
					<CreateClientForm
						open={dialogs.createClient}
						onOpenChange={e => setDialogs('createClient', e)}
					/>
					<div className='flex justify-between items-center'>
						<div className='relative'>
							<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Search Clients...'
								onChange={e => setFilter(e.target.value)}
								className='pl-8 w-[400px]'
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

					<div className='border rounded-lg'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='px-4'>Name</TableHead>
									<TableHead className='hidden md:flex items-center'>
										Username
									</TableHead>
									<TableHead>Credits</TableHead>
									<TableHead>Created</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredClients?.map(client => (
									<TableRow key={client._id} className='cursor-pointer'>
										<TableCell className='font-medium px-4'>
											{client.name}
										</TableCell>
										<TableCell className='max-w-[300px] hidden md:table-cell items-center truncate'>
											{client.username}
										</TableCell>
										<TableCell>
											<Badge variant='secondary' className='text-xs'>
												{client.credits}
											</Badge>
										</TableCell>
										<TableCell className='text-sm text-muted-foreground'>
											{new Date(client._creationTime).toLocaleDateString(
												'en-US',
												{
													day: 'numeric',
													month: 'short',
													year: 'numeric',
												},
											)}
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
