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
import { PasswordInput } from './ui/password-input'
import { useConvex, useMutation } from 'convex/react'
import { api } from 'convex/_generated/api'
import { useAuth } from '@/context/auth-context'
import { toast } from 'sonner'
import { useClientState } from '@/context/client-state-context'

export function CreateClientForm() {
	const convex = useConvex()
	const formSchema = z
		.object({
			name: z.string().min(1).min(2),
			email: z.string().optional(),
			username: z.string().min(1).min(2),
			credits: z.number(),
			password: z
				.string()
				.min(1)
				.min(8, { message: "Password Must be (8) Character's Long" }),
			confirm_password: z.string().min(8),
		})
		.superRefine(
			async ({ password, confirm_password, username, email }, ctx) => {
				const usernameExists = await convex.query(api.client.usernameExists, {
					username,
				})
				if (usernameExists) {
					ctx.addIssue({
						code: 'custom',
						message: 'username is already taken',
						path: ['username'],
					})
				}
				if (email) {
					const emailExists = await convex.query(api.client.emailExists, {
						email,
					})
					if (emailExists) {
						ctx.addIssue({
							code: 'custom',
							message: 'email already exits',
							path: ['email'],
						})
					}
				}

				if (password !== confirm_password)
					ctx.addIssue({
						code: 'custom',
						message: 'Password do not match',
						path: ['confirm_password'],
					})
			},
		)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			credits: 10000,
		},
	})
	const { createClientDialog } = useClientState()
	const auth = useAuth()
	const createClient = useMutation(api.client.createClient)

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await createClient({
				name: values.name,
				credits: values.credits,
				userId: auth.user!._id,
				username: values.username,
				password: values.password,
			})
			toast.success('Client Created Successfully.')
			createClientDialog.setState(false)
		} catch (error) {
			toast.error('Error While Creating Client.')
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder='Client Name' type='text' {...field} />
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
							<FormLabel>Client's Email (Optional)</FormLabel>
							<FormControl>
								<Input placeholder='Clients' type='text' {...field} />
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
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder='client_123' type='text' {...field} />
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
									placeholder='Enter Your Password'
									type='password'
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
									type='password'
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full'>
					Submit
				</Button>
			</form>
		</Form>
	)
}
