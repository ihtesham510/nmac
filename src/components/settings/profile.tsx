import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import * as z from 'zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '../ui/input'
import { useAuth } from '@/context/auth-context'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useConvex, useMutation } from 'convex/react'
import { api } from 'convex/_generated/api'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { PasswordInput } from '../ui/password-input'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card'
import {
	Camera,
	User,
	Mail,
	Lock,
	Trash2,
	Upload,
	LoaderCircle,
} from 'lucide-react'

export function Profile() {
	const auth = useAuth()
	const deleteAccount = useMutation(api.user.deleteAccount)
	const convex = useConvex()
	const [selectedFile, setFile] = useState<File | null>(null)
	const formSchema = z.object({
		first_name: z.string().min(1, 'First name is required'),
		last_name: z.string().min(1, 'Last name is required'),
		email: z.string().email('Please enter a valid email address'),
	})
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			first_name: auth.user?.first_name,
			last_name: auth.user?.last_name,
			email: auth.user?.email,
		},
	})
	const ref = useRef<HTMLInputElement | null>(null)
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setFile(file)
		}
	}
	useEffect(() => {
		;(async () => {
			if (selectedFile) {
				if (selectedFile.size > 5 * 1024 * 1024)
					return toast.error('File is larger then 5Mb')
				const t1 = toast.loading('Uploading')
				const url = await convex.mutation(api.image.getUploadUrl)
				const { storageId } = await axios
					.post(url, selectedFile, {
						headers: { 'Content-Type': selectedFile.type },
					})
					.then(data => data.data)
				const image_url = await convex.mutation(api.image.getImageUrl, {
					id: storageId,
				})
				if (image_url && auth.user) {
					await convex.mutation(api.user.updateImage, {
						userId: auth.user._id,
						url: image_url,
						storageId,
					})
					toast.dismiss(t1)
					setFile(null)
					return toast.success('Profile picture updated successfully')
				}
			}
		})()
	}, [selectedFile, convex, auth])

	const updateUser = useMutation(api.user.updateUser)

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			if (auth.user) {
				await updateUser({
					userId: auth.user._id,
					...values,
				})
				form.reset({
					email: auth.user.email,
					first_name: auth.user.first_name,
					last_name: auth.user.last_name,
				})
			}
			toast.success('Profile updated successfully!')
		} catch (error) {
			console.error('Form submission error', error)
			toast.error('Failed to update profile. Please try again.')
		}
	}

	return (
		<div className='max-w-full mx-auto space-y-8'>
			{/* Profile Picture Section */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Camera className='h-5 w-5' />
						Profile Picture
					</CardTitle>
					<CardDescription>
						Update your profile picture. Recommended size is 400x400px.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex items-center gap-6'>
						<div className='relative'>
							<Avatar className='h-20 w-20'>
								<AvatarImage
									src={auth.user?.image?.url}
									alt='Profile picture'
								/>
								<AvatarFallback className='text-lg'>
									{auth.user?.first_name?.[0]}
									{auth.user?.last_name?.[0]}
								</AvatarFallback>
							</Avatar>
							<button
								type='button'
								onClick={() => ref.current?.click()}
								className='absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors'
							>
								<Upload className='h-4 w-4' />
							</button>
						</div>
						<div className='space-y-2'>
							<Button
								type='button'
								variant='outline'
								onClick={() => ref.current?.click()}
								className='flex items-center gap-2'
							>
								<Upload className='h-4 w-4' />
								Upload New Picture
							</Button>
							<p className='text-sm text-muted-foreground'>
								JPG, PNG or GIF. Max size 5MB.
							</p>
						</div>
						<input
							type='file'
							ref={ref}
							onChange={handleChange}
							accept='image/*'
							className='hidden'
						/>
					</div>
				</CardContent>
			</Card>

			{/* Personal Information Section */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<User className='h-5 w-5' />
						Personal Information
					</CardTitle>
					<CardDescription>
						Update your personal details and contact information.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<FormField
									control={form.control}
									name='first_name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input placeholder='Enter your first name' {...field} />
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
												<Input placeholder='Enter your last name' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='flex items-center gap-2'>
											<Mail className='h-4 w-4' />
											Email Address
										</FormLabel>
										<FormControl>
											<Input
												placeholder='Enter your email address'
												type='email'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{form.formState.isDirty && (
								<div className='flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-dashed'>
									<div className='flex items-center gap-2'>
										<div className='h-2 w-2 bg-orange-500 rounded-full animate-pulse' />
										<span className='text-sm font-medium'>Unsaved changes</span>
									</div>
									<div className='flex gap-2'>
										<Button
											type='button'
											variant='outline'
											size='sm'
											onClick={() =>
												form.reset({
													first_name: auth.user?.first_name,
													last_name: auth.user?.last_name,
													email: auth.user?.email,
												})
											}
										>
											Discard
										</Button>
										<Button
											type='submit'
											disabled={form.formState.isSubmitting}
											size='sm'
										>
											{form.formState.isSubmitting ? (
												<LoaderCircle className='size-4 animate-spin' />
											) : (
												'Save Changes'
											)}
										</Button>
									</div>
								</div>
							)}
						</form>
					</Form>
				</CardContent>
			</Card>

			{/* Security Section */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Lock className='h-5 w-5' />
						Security
					</CardTitle>
					<CardDescription>
						Manage your password and account security settings.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex items-center justify-between'>
						<div className='space-y-1'>
							<p className='font-medium'>Password</p>
							<p className='text-sm text-muted-foreground'>
								Last changed 30 days ago
							</p>
						</div>
						<ChangePassword />
					</div>
				</CardContent>
			</Card>

			{/* Danger Zone */}
			<Card className='border-destructive/20'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2 text-destructive'>
						<Trash2 className='h-5 w-5' />
						Danger Zone
					</CardTitle>
					<CardDescription>
						Permanently delete your account and all associated data.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<AlertDialog>
						<div className='flex items-center justify-between'>
							<div className='space-y-1'>
								<p className='font-medium'>Delete Account</p>
								<p className='text-sm text-muted-foreground'>
									This action cannot be undone. All your data will be
									permanently removed.
								</p>
							</div>
							<AlertDialogTrigger asChild>
								<Button
									variant='destructive'
									className='flex items-center gap-2'
								>
									<Trash2 className='h-4 w-4' />
									Delete Account
								</Button>
							</AlertDialogTrigger>
						</div>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete
									your account and remove your data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={async () =>
										await deleteAccount({ userId: auth.user!._id })
									}
									className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
								>
									Delete Account
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardContent>
			</Card>
		</div>
	)
}

function ChangePassword() {
	const auth = useAuth()
	const formSchema = z
		.object({
			current_password: z.string().min(1, 'Current password is required'),
			new_password: z.string().min(8, 'Password must be at least 8 characters'),
			confirm_password: z.string().min(1, 'Please confirm your password'),
		})
		.refine(data => data.new_password === data.confirm_password, {
			message: "Passwords don't match",
			path: ['confirm_password'],
		})

	const changePassword = useMutation(api.user.changePassword)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})
	const [open, setIsOpen] = useState(false)

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const res = await changePassword({
				userId: auth.user!._id,
				current_password: values.current_password,
				new_password: values.new_password,
			})
			if (res === 'wrong_password') {
				form.setError('current_password', {
					message: 'Current password is incorrect',
				})
				return
			}

			toast.success('Password changed successfully!')
			form.reset()
			setIsOpen(false)
		} catch (error) {
			toast.error('Failed to change password. Please try again.')
		}
	}

	return (
		<Dialog open={open} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline'>Change Password</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Change Password</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='current_password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Current Password</FormLabel>
									<FormControl>
										<PasswordInput
											placeholder='Enter your current password'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='new_password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<PasswordInput
											placeholder='Enter your new password'
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
									<FormLabel>Confirm New Password</FormLabel>
									<FormControl>
										<PasswordInput
											placeholder='Confirm your new password'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='flex justify-end gap-3 pt-4'>
							<Button
								type='button'
								variant='outline'
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</Button>
							<Button type='submit'>Update Password</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
