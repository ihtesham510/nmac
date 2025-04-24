import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from '@tanstack/react-router'
import { BuildingIcon } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { useAuth } from '@/context/auth-context'
import { LoaderComponent } from '@/components/loader'

export const Route = createFileRoute('/(auth)/register')({
	component: RouteComponent,
	async beforeLoad({ context: { auth } }) {
		await auth.prefetch()
		if (auth.isAuthenticated.authenticated) {
			throw redirect({ to: '/dashboard' })
		}
	},
	pendingComponent: LoaderComponent,
})

function RouteComponent() {
	const formSchema = z.object({
		first_name: z.string().min(1),
		last_name: z.string().min(1),
		elevenLabs_api_key: z.string(),
		email: z.string().email(),
		password: z
			.string()
			.min(8, { message: "Password must be at least (8) character's long." }),
	})
	const navigate = useNavigate()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})
	const auth = useAuth()

	function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			auth.signUp(values)
			toast.success('Registered Successfully.')
			navigate({ to: '/dashboard' })
			return
		} catch (error) {
			toast.error('Failed to submit the form. Please try again.')
		}
	}
	return (
		<section className='flex h-screen bg-zinc-50 px-4 py-4 dark:bg-transparent'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]'
				>
					<div className='bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6'>
						<div className='text-center'>
							<Link to='/' aria-label='go home' className='mx-auto block w-fit'>
								<BuildingIcon className='size-12' />
							</Link>
							<h1 className='text-title mb-1 mt-4 text-xl font-semibold'>
								Create an Account
							</h1>
							<p className='text-sm'>
								Welcome! Create an account to get started
							</p>
						</div>

						<div className='mt-6 space-y-6'>
							<div className='grid grid-cols-2 gap-3'>
								<FormField
									control={form.control}
									name='first_name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input
													placeholder='First Name'
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
									name='last_name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input
													placeholder='Last Name'
													required
													type='text'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name='elevenLabs_api_key'
								render={({ field }) => (
									<FormItem>
										<FormLabel>11Labs Api Key</FormLabel>
										<FormControl>
											<Input
												placeholder='API key.'
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
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder='user123@example.com'
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
											<Input
												type='password'
												required
												placeholder='Enter Your Password'
												id='pwd'
												className='input sz-md variant-mixed'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button className='w-full'>Sign Up</Button>
						</div>
					</div>

					<div className='p-3'>
						<p className='text-accent-foreground text-center text-sm'>
							Have an account ?
							<Button asChild variant='link' className='px-2'>
								<Link to='/sign-in'>Sign In</Link>
							</Button>
						</p>
					</div>
				</form>
			</Form>
		</section>
	)
}
