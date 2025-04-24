import { useAuth } from '@/context/auth-context'
import { useQuery } from 'convex/react'
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
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { EllipsisIcon, PlusIcon } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { CreateClientForm } from '@/components/create-client-form'

export const Route = createFileRoute('/dashboard/clients/')({
	component: RouteComponent,
})

function RouteComponent() {
	const auth = useAuth()
	const [filter, setFilter] = useState<string>()

	const clients = useQuery(api.client.listClients, { id: auth.user!._id })

	return (
		<Dialog>
			<div className='h-screen w-full'>
				<div className='grid grid-cols-1 m-20 gap-10'>
					<div className='flex justify-between items-center'>
						<Input
							placeholder='Search Agents ...'
							value={filter}
							className='w-[400px]'
							onChange={e => setFilter(e.target.value)}
						/>
						<DialogTrigger>
							<Button className='flex gap-2' variant='outline' size='sm'>
								<PlusIcon /> <p className='hidden md:block'>Create Client</p>
							</Button>
						</DialogTrigger>
					</div>
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
							{clients &&
								clients.map(client => (
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
												<DropdownMenuTrigger asChild className='pr-6'>
													<Button size='icon' variant='ghost'>
														<EllipsisIcon className='size-5' />
													</Button>
												</DropdownMenuTrigger>
											</TableCell>
										</TableRow>
										<DropdownMenuContent>
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuItem onClick={() => {}}>
												Delete Agent
											</DropdownMenuItem>
											<DropdownMenuItem onClick={async () => {}}>
												Copy Agent Id
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								))}
						</TableBody>
					</Table>
				</div>
			</div>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Client</DialogTitle>
					<DialogDescription>
						Create a new client and attach you're agent.
					</DialogDescription>
				</DialogHeader>
				<CreateClientForm />
			</DialogContent>
		</Dialog>
	)
}
