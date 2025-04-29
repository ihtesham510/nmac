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
import { PasswordInput } from './ui/password-input'
import type { Clients } from '@/lib/types'

const formSchema = z
	.object({
		client_name: z.string().min(2),
		username: z.string().min(2),
		email: z.string().optional(),
		password: z.string().min(2),
		confirm_password: z.string().min(2),
	})
	.superRefine(({ password, confirm_password }, ctx) => {
		if (password !== confirm_password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password do not match',
				path: ['confirm_password'],
			})
		}
	})

export function UpdateClientForm({ client }: { client: Clients[0] }) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			client_name: client.name,
			username: client.username,
			email: client.email,
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			console.log(values)
			toast(
				<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
					<code className='text-white'>{JSON.stringify(values, null, 2)}</code>
				</pre>,
			)
		} catch (error) {
			console.error('Form submission error', error)
			toast.error('Failed to submit the form. Please try again.')
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 py-2'>
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
								<Input placeholder='user@example.com' type='text' {...field} />
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
								<PasswordInput placeholder='Enter Client Password' {...field} />
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
					<Button type='button' variant='ghost' className='cursor-pointer'>
						cancel
					</Button>
					<Button type='submit' size='sm' className='cursor-pointer'>
						save
					</Button>
				</div>
			</form>
		</Form>
	)
}
