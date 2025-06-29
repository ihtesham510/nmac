import { useMutation } from 'convex/react'
import { api } from 'convex/_generated/api'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { LoaderCircle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useId } from 'react'
import type { Clients } from '@/lib/types'

interface Props {
	open: boolean
	onOpenChange: (e: boolean) => void
	client: Clients[0]
}

export function ManageSubscriptionForm({ open, onOpenChange, client }: Props) {
	const id = useId()
	const updateClientSubscription = useMutation(
		api.subscriptions.updateSubscription,
	)
	const addClientSubscription = useMutation(api.subscriptions.subscribeTier)
	const removeClientSubscription = useMutation(
		api.subscriptions.unSubscribeTier,
	)

	// Check if client has existing subscription
	const hasExistingSubscription = !!client.subscription
	const isAddingSubscription = !hasExistingSubscription

	const formSchema = z.object({
		plan: z.enum(['base', 'pro', 'business'], {
			required_error: 'Please select a subscription plan.',
		}),
		interval: z.number().min(1).max(12, 'Interval cannot exceed 12 months'),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			plan: client.subscription ? client.subscription.type : undefined,
			interval: client.subscription ? client.subscription.interval : 1,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			if (isAddingSubscription) {
				await addClientSubscription({
					clientId: client._id,
					type: values.plan,
					interval: values.interval,
				})
			} else {
				await updateClientSubscription({
					clientId: client._id,
					type: values.plan,
					interval: values.interval,
				})
			}

			await new Promise(res => setTimeout(res, 400))
			onOpenChange(false)

			const successMessage = isAddingSubscription
				? 'Subscription plan added successfully.'
				: 'Subscription plan updated successfully.'
			toast.success(successMessage)
		} catch (error) {
			console.error('Failed to manage subscription:', error)
			const errorMessage = isAddingSubscription
				? 'Failed to add subscription plan. Please try again.'
				: 'Failed to update subscription plan. Please try again.'
			toast.error(errorMessage)
		}
	}

	async function handleRemoveSubscription() {
		try {
			await removeClientSubscription({
				clientId: client._id,
			})

			await new Promise(res => setTimeout(res, 400))
			onOpenChange(false)
			toast.success('Subscription removed successfully.')
		} catch (error) {
			console.error('Failed to remove subscription:', error)
			toast.error('Failed to remove subscription. Please try again.')
		}
	}

	const planDetails = {
		base: { name: 'Base', price: 4 },
		pro: { name: 'Pro', price: 19 },
		business: { name: 'Business', price: 32 },
	}

	const selectedPlan = form.watch('plan')
	const selectedInterval = form.watch('interval')
	const selectedPlanPrice = selectedPlan ? planDetails[selectedPlan].price : 0
	const totalPrice = selectedPlanPrice * selectedInterval

	const intervalOptions = Array.from({ length: 12 }, (_, i) => ({
		value: i + 1,
		label: i + 1 === 1 ? '1 month' : `${i + 1} months`,
	}))

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-md overflow-auto max-h-[90vh]'>
				<div className='mb-2 flex flex-col gap-2'>
					<DialogHeader>
						<DialogTitle className='text-left'>
							{isAddingSubscription
								? 'Add Subscription Plan'
								: `Manage ${client.name}'s Subscription`}
						</DialogTitle>
						<DialogDescription className='text-left'>
							{isAddingSubscription
								? `Select a subscription plan for ${client.username}.`
								: `Update or remove ${client.username}'s subscription plan.`}
						</DialogDescription>
					</DialogHeader>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
						<FormField
							control={form.control}
							name='plan'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='ml-1 text-lg font-bold'>
										Subscription Plan
									</FormLabel>
									<FormControl>
										<RadioGroup
											value={field.value}
											onValueChange={field.onChange}
											className='gap-2'
										>
											{Object.entries(planDetails).map(([value, details]) => (
												<div
													key={value}
													className='relative flex w-full items-center gap-2 rounded-lg border border-input px-4 py-3 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent'
												>
													<RadioGroupItem
														value={value}
														id={`${id}-${value}`}
														aria-describedby={`${id}-${value}-description`}
														className='order-1 after:absolute after:inset-0'
													/>
													<div className='grid grow gap-1'>
														<Label htmlFor={`${id}-${value}`}>
															{details.name}
														</Label>
														<p
															id={`${id}-${value}-description`}
															className='text-xs text-muted-foreground'
														>
															${details.price} per member/month
														</p>
													</div>
												</div>
											))}
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='interval'
							render={({ field }) => (
								<FormItem className='flex justify-between items-center ml-1'>
									<FormLabel className='font-bold'>Billing Interval</FormLabel>
									<Select
										value={field.value?.toString()}
										onValueChange={value => field.onChange(parseInt(value))}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select billing interval' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{intervalOptions.map(option => (
												<SelectItem
													key={option.value}
													value={option.value.toString()}
												>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{selectedPlan && selectedInterval && (
							<div className='rounded-lg border border-input bg-muted/20 p-4'>
								<div className='flex justify-between items-center'>
									<span className='text-sm font-medium'>Total Cost:</span>
									<span className='text-lg font-bold'>
										${totalPrice} for {selectedInterval}{' '}
										{selectedInterval === 1 ? 'month' : 'months'}
									</span>
								</div>
							</div>
						)}

						<div className='grid gap-2'>
							<Button
								type='submit'
								className='w-full'
								disabled={
									!form.formState.isDirty || form.formState.isSubmitting
								}
							>
								{form.formState.isSubmitting ? (
									<LoaderCircle className='size-4 animate-spin' />
								) : isAddingSubscription ? (
									'Add subscription'
								) : (
									'Update subscription'
								)}
							</Button>

							{hasExistingSubscription && (
								<Button
									type='button'
									variant='destructive'
									className='w-full'
									onClick={handleRemoveSubscription}
								>
									<Trash2 className='size-4 mr-2' />
									Remove subscription
								</Button>
							)}

							<DialogClose asChild>
								<Button
									type='button'
									variant='ghost'
									className='w-full'
									onClick={() => onOpenChange(false)}
								>
									Cancel
								</Button>
							</DialogClose>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
