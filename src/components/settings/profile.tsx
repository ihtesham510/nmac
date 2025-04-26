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
import { Separator } from '../ui/separator'
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

export function Profile() {
	const auth = useAuth()
	const deleteAccount = useMutation(api.user.deleteAccount)
	const convex = useConvex()
	const [selectedFile, setFile] = useState<File | null>(null)
	const formSchema = z.object({
		first_name: z.string().min(1),
		last_name: z.string().min(1),
		email: z.string().email(),
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
					return toast.success('Updated Successfully')
				}
			}
		})()
	}, [selectedFile, convex, auth])

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
		<div className='space-y-6'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='w-full mt-5 flex flex-col space-y-6'
				>
					<div className='flex justify-between pr-20 px-4 items-center'>
						<h1 className='text-lg font-bold'>Profile Picture</h1>
						<input
							type='file'
							ref={ref}
							onChange={handleChange}
							className='hidden'
						/>
						<span className='flex gap-6 items-center w-[350px]'>
							<Avatar className='size-12'>
								<AvatarImage src={auth.user?.image?.url} alt='profile_image' />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<Button
								type='button'
								onClick={() => {
									if (ref.current) {
										ref.current.click()
									}
								}}
							>
								Upload Image
							</Button>
						</span>
					</div>

					<Separator className='px-20 w-full' />
					<div className='flex justify-between pr-20 px-4 items-center'>
						<h1 className='text-lg font-bold'>First Name</h1>
						<div className='w-[350px]'>
							<FormField
								control={form.control}
								name='first_name'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder='First Name'
												className='w-full'
												type='text'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
					<div className='flex justify-between pr-20 px-4 items-center'>
						<h1 className='text-lg font-bold'>Last Name</h1>
						<div className='w-[350px]'>
							<FormField
								control={form.control}
								name='last_name'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder='Last Name' type='text' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
					<div className='flex justify-between pr-20 px-4 items-center'>
						<h1 className='text-lg font-bold'>Email</h1>
						<div className='w-[350px]'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
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
						</div>
					</div>
					{form.formState.isDirty && (
						<div className='fixed bottom-10 w-[800px] right-1/2 translate-x-1/2 flex justify-between items-center gap-4 bg-muted/20 p-4 rounded-2xl shadow'>
							<h1 className='text-sm font-semibold'>Changes Detected</h1>

							<div className='flex justify-center items-center gap-4'>
								<Button
									variant='outline'
									className='text-sm'
									size='sm'
									onClick={() =>
										form.reset({
											first_name: auth.user?.first_name,
											last_name: auth.user?.last_name,
										})
									}
								>
									Clear
								</Button>
								<Button size='sm' className='text-sm' type='submit'>
									Save
								</Button>
							</div>
						</div>
					)}
				</form>
			</Form>
			<ChangePassword />

			<AlertDialog>
				<div className='flex justify-between pr-20 px-4 items-center'>
					<h1 className='text-lg font-bold'>Account</h1>
					<div className='w-[350px]'>
						<AlertDialogTrigger>
							<Button variant='destructive' className='cursor-pointer'>
								Delete Account
							</Button>
						</AlertDialogTrigger>
					</div>
				</div>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={async () =>
								await deleteAccount({ userId: auth.user!._id })
							}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}

function ChangePassword() {
	const auth = useAuth()
	const formSchema = z.object({
		current_password: z.string().min(1),
		new_password: z.string().min(1),
		confirm_password: z.string().min(1),
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
				return toast.error('wrong Password')
			}

			toast.success('Password Changed Successfully.')
			return setIsOpen(false)
		} catch (error) {
			toast.error('Error While Changing Password.')
		}
	}
	return (
		<Dialog open={open} onOpenChange={e => setIsOpen(e)}>
			<div className='flex justify-between pr-20 px-4 items-center'>
				<h1 className='text-lg font-bold'>Password</h1>
				<div className='w-[350px] flex justify-start'>
					<DialogTrigger>
						<Button size='sm' className='w-max cursor-pointer'>
							Change Password
						</Button>
					</DialogTrigger>
				</div>
			</div>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Change Your Password</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8 py-2 mt-5'
					>
						<FormField
							control={form.control}
							name='current_password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Current Password</FormLabel>
									<FormControl>
										<PasswordInput
											placeholder='Your Current Password'
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
										<PasswordInput placeholder='Your New Password' {...field} />
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
						<div className='flex justify-end gap-4'>
							<Button
								type='reset'
								variant='ghost'
								className='cursor-pointer'
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</Button>
							<Button type='submit' className='cursor-pointer'>
								Change Password
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
