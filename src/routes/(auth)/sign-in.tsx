import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useConvex } from 'convex/react'
import { LoaderCircle, PhoneIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
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
import { PasswordInput } from '@/components/ui/password-input'
import { useAuth } from '@/context/auth-context'
import { UnProtectedRoute } from '@/hoc/unprotected-route'

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
		} catch (_err) {
			toast.error('Error While Signing In')
		}
	}

	return (
		<section className='flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='m-auto h-fit w-full max-w-92'
				>
					<div>
						<Link to='/' aria-label='go home'>
							<PhoneIcon className='size-6' />
						</Link>
						<h1 className='mt-4 mb-1 font-semibold text-xl'>
							Sign In to "Never Miss A Call"
						</h1>
						<p>Welcome back! Sign in to continue</p>
					</div>
					<div className='my-10 space-y-6'>
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
						className='flex w-full items-center justify-center'
						type='submit'
					>
						{form.formState.isSubmitting ? (
							<LoaderCircle className='size-4 animate-spin' />
						) : (
							'Continue'
						)}
					</Button>
				</form>
			</Form>
		</section>
	)
}
