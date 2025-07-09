import { useConvex, useMutation } from 'convex/react'
import { api } from 'convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog } from '@/components/ui/dialog'
import * as z from 'zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { LoaderCircle } from 'lucide-react'
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { Clients } from '@/lib/types'
import { PasswordInput } from '@/components/ui/password-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface Props {
	open: boolean
	onOpenChange: (e: boolean) => void
	client: Clients[0]
}

export function EditClientForm({ client, open, onOpenChange }: Props) {
	const convex = useConvex()
	const updateClient = useMutation(api.client.updateClient)
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
				if (email) {
					const emailExists = await convex.query(api.client.emailExists, {
						email,
					})
					if (emailExists && client.email !== email) {
						ctx.addIssue({
							code: 'custom',
							message: 'username is already taken',
							path: ['username'],
						})
					}
				}
				const usernameExists = await convex.query(api.client.usernameExists, {
					username,
				})
				if (usernameExists && client.username !== username) {
					ctx.addIssue({
						code: 'custom',
						message: 'username already taken',
						path: ['username'],
					})
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
			onOpenChange(false)
			toast.success('Client Updated Successfully.')
		} catch (error) {
			toast.error('Failed to Update the Client. Please try again.')
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-h-[90vh] overflow-auto'>
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
								onClick={() => onOpenChange(false)}
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
									<LoaderCircle className='size-4 animate-spin' />
								) : (
									'save'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
