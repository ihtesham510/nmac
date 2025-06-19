import { useKnowledgeBase } from '@/hooks/use-knowledge-base'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileType, LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { useElevenLabsClient } from '@/api/client'
import type { GetAgentResponseModel } from '@elevenlabs/elevenlabs-js/api'
import { Textarea } from '../ui/textarea'

export function AddTextForm({
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
		text: z.string(),
		name: z.string(),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await addKnowledgeBase.addKnowledgeBase.mutateAsync({
			text: { text: values.text, name: values.name },
		})
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-4'>
						<Button variant='secondary' size='icon'>
							<FileType className='size-5' />
						</Button>
						Add Text
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
										<Input type='text' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='text'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Text</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											className='min-h-[150px] max-h-[300px]'
										/>
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
