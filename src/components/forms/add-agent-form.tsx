import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuery as useTanstackQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useMutation } from 'convex/react'
import { api } from 'convex/_generated/api'
import { useAuth } from '@/context/auth-context'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import { TagsInput } from '@/components/ui/tags-input'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'
import { queries } from '@/api/query-options'
import { useElevenLabsClient } from '@/api/client'

const formSchema = z.object({
	agent_name: z.string().min(1).min(2),
	agent_id: z.string().min(4),
	agent_description: z.string().min(0),
	agent_tags: z.array(z.string()).nonempty('Please at least one item'),
})

interface Props {
	open: boolean
	onOpenChange: (e: boolean) => void
}

export function AddAgentForm({ open, onOpenChange }: Props) {
	const auth = useAuth()
	const client = useElevenLabsClient()
	const conv_agents = useTanstackQuery(queries.list_agents(client))
	const createAgent = useMutation(api.agents.createAgent)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			agent_tags: [],
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			if (auth.user) {
				await createAgent({
					name: values.agent_name,
					description: values.agent_description,
					userId: auth.user?._id,
					tags: values.agent_tags,
					agentId: values.agent_id,
				})
				form.reset()
				onOpenChange(false)
			}
		} catch (error) {
			toast.error('Error while importing agent. Please try again.')
		}
	}
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle className='text-xl font-semibold'>Add Agent</SheetTitle>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8 px-4'
					>
						<FormField
							control={form.control}
							name='agent_name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Agent Name</FormLabel>
									<FormControl>
										<Input placeholder='agent name' type='text' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='agent_id'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Select Agent</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Select Agent To import' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{conv_agents.data?.agents.map(agent => (
												<SelectItem value={agent.agentId}>
													{agent.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='agent_description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Agent Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder='A small description for agent'
											className='resize-none'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='agent_tags'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Agent Tags</FormLabel>
									<FormControl>
										<TagsInput
											value={field.value}
											onValueChange={field.onChange}
											placeholder='Enter your tags'
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit' className='w-full flex gap-2'>
							<PlusIcon className='size-4' />
							Add
						</Button>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
