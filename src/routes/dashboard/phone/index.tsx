import { createFileRoute } from '@tanstack/react-router'

import { toast } from 'sonner'
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

import { Phone, PhoneIcon, PlusIcon } from 'lucide-react'
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
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'

export const Route = createFileRoute('/dashboard/phone/')({
	component: RouteComponent,
})

function RouteComponent() {
	const agents = useAgents()
	const phoneNos = useQuery(
		queries.list_phone_no({ filter: agents.map(agent => agent.agentId) }),
	)
	return (
		<Sheet>
			<SheetForm />
			<div className='m-10'>
				<div className='flex items-center justify-between mb-6'>
					<div>
						<h1 className='text-2xl font-bold'>Phone Numbers</h1>
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
				{phoneNos.data && <PhoneNumbersTable phoneNos={phoneNos.data} />}
			</div>
		</Sheet>
	)
}

function PhoneNumbersTable({
	phoneNos,
}: {
	phoneNos: GetPhoneNumberResponseModel[]
}) {
	return (
		<>
			{phoneNos.length !== 0 && (
				<Table>
					<TableCaption>A list of your phone numbers.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className='w-[150px]'>Phone No.</TableHead>
							<TableHead>Label</TableHead>
							<TableHead className='w-[150px]'>Assigned Agent</TableHead>
							<TableHead className='w-[70px]'>Provider</TableHead>
							<TableHead className='text-ring'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{phoneNos.map(phoneNo => (
							<TableRow>
								<TableCell className='font-medium'>
									{phoneNo.phone_number}
								</TableCell>
								<TableCell>{phoneNo.label}</TableCell>
								<TableCell>
									{phoneNo.assigned_agent ? (
										phoneNo.assigned_agent.agent_name
									) : (
										<Badge variant='outline'>No Assigned Agent</Badge>
									)}
								</TableCell>
								<TableCell className='text-right'>
									<Badge
										variant='outline'
										className={getProviderBadgeColor(phoneNo.provider)}
									>
										{phoneNo.provider}
									</Badge>
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
					<Button size='lg' className='gap-2'>
						<PlusIcon className='h-5 w-5' />
						Import Number
					</Button>
				</div>
			)}
		</>
	)
}
const formSchema = z.object({
	label: z.string().min(1),
	phone_no: z.string(),
	sid: z.string(),
	token: z.string(),
})

function SheetForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			console.log(values)
		} catch (error) {
			console.error('Form submission error', error)
			toast.error('Failed to submit the form. Please try again.')
		}
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
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 m-5'>
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
					<Button type='submit' className='w-full'>
						Add
					</Button>
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
