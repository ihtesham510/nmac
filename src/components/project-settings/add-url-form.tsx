import { useKnowledgeBase } from '@/hooks/use-knowledge-base'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { useElevenLabsClient } from '@/api/client'
import type { GetAgentResponseModel } from '@elevenlabs/elevenlabs-js/api'
import { Globe, LoaderCircle } from 'lucide-react'

export function AddUrlForm({
	data,
	open,
	onOpenChange,
}: {
	data: GetAgentResponseModel
	open: boolean
	onOpenChange: (e: boolean) => void
}) {
	const client = useElevenLabsClient()
	const addKnowledgeBase = useKnowledgeBase(client, data)
	const formSchema = z.object({
		url: z.string().min(2).url(),
		name: z.string().min(2),
	})
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})
	async function onSubmit(values: z.infer<typeof formSchema>) {
		await addKnowledgeBase.addKnowledgeBase.mutateAsync(
			{
				url: { url: values.url, name: values.name },
			},
			{
				onSuccess() {
					toast.success('Knowledge base added successfully')
					onOpenChange(false)
				},
			},
		)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-4'>
						<Button variant='secondary' size='icon'>
							<Globe className='size-5' />
						</Button>
						Add URL
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder='' type='text' {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='url'
							render={({ field }) => (
								<FormItem>
									<FormLabel>URL</FormLabel>
									<FormControl>
										<Input placeholder='' type='' {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type='submit' disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? (
									<LoaderCircle className='size-4 animate-spin' />
								) : (
									'Add'
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
