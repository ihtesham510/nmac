import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoaderCircle, PhoneIcon } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { toast } from 'sonner'
import { PasswordInput } from '@/components/ui/password-input'
import { UnProtectedRoute } from '@/hoc/unprotected-route'
import { useConvex } from 'convex/react'
import { api } from 'convex/_generated/api'

export const Route = createFileRoute('/(auth)/sign-in')({
	component: () => (
		<UnProtectedRoute>
			<RouteComponent />
		</UnProtectedRoute>
	),
})

function RouteComponent() {
	const convex = useConvex()
	const formSchema = z
		.object({
			username: z.string(),
			password: z
				.string()
				.min(8, { message: "Password must be at least (8) character's long." }),
		})
		.superRefine(async ({ username, password }, ctx) => {
			const user = await convex.query(api.user.checkUser, {
				username,
				password,
			})
			if (user === 'user_not_found') {
				ctx.addIssue({
					code: 'custom',
					message: 'Invalid username does not exists.',
					path: ['username'],
				})
			}
			if (user === 'incorrect_password') {
				ctx.addIssue({
					code: 'custom',
					message: 'Inncorrect Password',
					path: ['password'],
				})
			}
		})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})
	const navigate = useNavigate()
	const auth = useAuth()
	function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			auth.signIn(values)
			navigate({ to: '/dashboard' })
		} catch (err) {
			toast.error('Error While Signing In')
		}
	}

	return (
		<section className='flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='max-w-92 m-auto h-fit w-full'
				>
					<div>
						<Link to='/' aria-label='go home'>
							<PhoneIcon className='size-6' />
						</Link>
						<h1 className='mb-1 mt-4 text-xl font-semibold'>
							Sign In to "Never Miss A Call"
						</h1>
						<p>Welcome back! Sign in to continue</p>
					</div>
					<div className='space-y-6 my-10'>
						<FormField
							control={form.control}
							name='username'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email Or Username</FormLabel>
									<FormControl>
										<Input
											placeholder='email or username'
											type='text'
											required
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
											placeholder='enter your password'
											required
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						className='w-full flex justify-center items-center'
						type='submit'
					>
						{form.formState.isSubmitting ? (
							<LoaderCircle className='size-4' />
						) : (
							'Continue'
						)}
					</Button>
				</form>
			</Form>
		</section>
	)
}
