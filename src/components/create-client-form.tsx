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

const formSchema = z
	.object({
		name: z.string().min(1).min(2),
		username: z.string().min(1).min(2),
		password: z
			.string()
			.min(1)
			.min(8, { message: "Password Must be (8) Character's Long" }),
		confirm_password: z.string().min(8),
	})
	.superRefine(({ password, confirm_password }, ctx) => {
		if (password !== confirm_password)
			ctx.addIssue({
				code: 'custom',
				message: 'Password do not match',
				path: ['confirm_password'],
			})
	})

export function CreateClientForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		try {
		} catch (error) {}
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
