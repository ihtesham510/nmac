import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutation } from 'convex/react'
import { api } from 'convex/_generated/api'
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
import type { Id } from 'convex/_generated/dataModel'
import { useQuery } from '@/cache/useQuery'
import type { Agent } from '@/lib/types'
import { LoaderCircle } from 'lucide-react'

interface Props {
	open: boolean
	onOpenChange: (e: boolean) => void
	agentId: Id<'agent'>
}

const formSchema = z.object({
	agent_name: z.string().min(1).min(2),
	agent_description: z.string().min(0),
	agent_tags: z.array(z.string()).nonempty('Please at least one item'),
})

export function EditAgentForm({ open, onOpenChange, agentId }: Props) {
	const agent = useQuery(api.agents.getAgent, { agentId })

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className='flex flex-col'>
				<SheetHeader>
					<SheetTitle className='text-xl font-semibold'>Edit Agent</SheetTitle>
				</SheetHeader>
				{agent && <EditForm agent={agent} onOpenChange={onOpenChange} />}
			</SheetContent>
		</Sheet>
	)
}

function EditForm({
	agent,
	onOpenChange,
}: {
	agent: NonNullable<Agent>
	onOpenChange: (e: boolean) => void
}) {
	const updateAgent = useMutation(api.agents.updateAgent)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			agent_name: agent.name,
			agent_description: agent.description,
			agent_tags: agent.tags,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await updateAgent({
			name: values.agent_name,
			description: values.agent_description,
			tags: values.agent_tags,
			agentId: agent._id,
		})
		onOpenChange(false)
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col space-y-6 mx-4 h-full'
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

				<SheetFooter className='-mx-4'>
					<Button
						type='submit'
						className='w-full flex gap-2'
						disabled={!form.formState.isDirty || form.formState.isSubmitting}
					>
						{form.formState.isSubmitting ? (
							<LoaderCircle className='size-4 animate-spin' />
						) : (
							'Save'
						)}
					</Button>
				</SheetFooter>
			</form>
		</Form>
	)
}
