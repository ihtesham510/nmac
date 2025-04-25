import { useAuth } from '@/context/auth-context'
import { useMutation, useQuery } from 'convex/react'
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMemo, useState } from 'react'
import { DeleteIcon, EllipsisIcon, PlusIcon } from 'lucide-react'
import { rabinKarpSearch } from '@/lib/utils'
import { useClientState } from '@/context/client-state-context'

export const Route = createFileRoute('/dashboard/clients/')({
	component: RouteComponent,
})

function RouteComponent() {
	const auth = useAuth()

	const [filter, setFilter] = useState<string>()
	const { createClientDialog, alert } = useClientState()

	const clients = useQuery(api.client.listClients, { id: auth.user!._id })
	const deleteClient = useMutation(api.client.deleteClient)

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
				<div className='flex justify-between items-center'>
					<Input
						placeholder='Search Agents ...'
						value={filter}
						className='w-[400px]'
						onChange={e => setFilter(e.target.value)}
					/>
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
								<TableHead className='w-[300px] pl-6'>Name</TableHead>
								<TableHead>Created At</TableHead>
								<TableHead className='text-right pr-6'>Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredClients &&
								filteredClients.map(client => (
									<DropdownMenu key={client._id}>
										<TableRow
											key={client._id}
											className='h-[50px] cursor-pointer'
										>
											<TableCell className='pl-6'>{client.name}</TableCell>
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
											<TableCell className='text-right'>
												<DropdownMenuTrigger asChild className='mr-4'>
													<Button size='icon' variant='ghost'>
														<EllipsisIcon className='size-5' />
													</Button>
												</DropdownMenuTrigger>
											</TableCell>
										</TableRow>
										<DropdownMenuContent className='w-[200px]'>
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuGroup>
												<DropdownMenuItem>Team</DropdownMenuItem>
												<DropdownMenuSub>
													<DropdownMenuSubTrigger>
														Invite users
													</DropdownMenuSubTrigger>
													<DropdownMenuPortal>
														<DropdownMenuSubContent>
															<DropdownMenuItem>Email</DropdownMenuItem>
															<DropdownMenuItem>Message</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem>More...</DropdownMenuItem>
														</DropdownMenuSubContent>
													</DropdownMenuPortal>
												</DropdownMenuSub>
												<DropdownMenuItem>
													New Team
													<DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
												</DropdownMenuItem>
											</DropdownMenuGroup>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() =>
													alert({
														dialogTitle: 'Are you absolutely sure?',
														dialogDescription:
															'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
														async onConfirm() {
															await deleteClient({ clientId: client._id })
														},
													})
												}
											>
												Delete client
												<DropdownMenuShortcut>
													<DeleteIcon className='size-4' />
												</DropdownMenuShortcut>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								))}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	)
}
