import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { PhoneInput } from '@/components/ui/phone-input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateAgent } from '@/hooks/use-update-agent'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import type { GetAgentResponseModel } from 'elevenlabs/api'
import { LoaderCircle, Wrench } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
	description: z.string().optional(),
	transfers: z.array(
		z.object({
			phone_number: z
				.string()
				.refine(val => (val === '' || !val ? null : isValidPhoneNumber(val)), {
					message: 'Invalid Phone no',
				}),
			condition: z.string(),
		}),
	),
})

export function AddTransferToHumanTool({
	open,
	onOpenChange,
	data,
}: {
	data: GetAgentResponseModel
	open?: boolean
	onOpenChange?: (e: boolean) => void
}) {
	const updateAgent = useUpdateAgent(data.agent_id)
	const queryClient = useQueryClient()
	const form = useForm({
		resolver: zodResolver(formSchema),
		mode: 'onBlur',
	})
	const { fields, remove, append } = useFieldArray({
		control: form.control,
		name: 'transfers',
	})
	async function onSubmit(values: z.infer<typeof formSchema>) {
		await updateAgent.mutateAsync(
			{
				agent: {
					prompt: {
						tools: [
							{
								name: 'transfer_to_number',
								description: values.description ?? '',
								type: 'system',
								params: {
									system_tool_type: 'transfer_to_number',
									transfers: values.transfers,
								},
							} as any,
							...(data.conversation_config.agent?.prompt?.tools ?? []),
						],
					},
				},
			},
			{
				async onSuccess() {
					await queryClient.invalidateQueries({
						queryKey: ['get_agent', data.agent_id],
					})
					toast.success('Tool Added Successfully')
					onOpenChange?.(false)
				},
			},
		)
	}
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className='w-full sm:max-w-md md:max-w-xl'>
				<SheetHeader>
					<SheetTitle className='flex gap-4 items-center'>
						<Button variant='secondary' size='icon' type='button'>
							<Wrench className='size-4' />
						</Button>{' '}
						Add Tool
					</SheetTitle>
				</SheetHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<ScrollArea className='h-[68vh] px-2 mx-2'>
							<div className='flex flex-col gap-4 mb-10'>
								<div className='grid rounded-lg bg-primary-foreground p-4'>
									<div className='flex justify-between items-center'>
										<div className='flex flex-col gap-1'>
											<h1 className='text-lg font-medium text-white'>
												Configuration
											</h1>
											<p className='mb-4 text-sm text-primary/50'>
												Describe to the LLM how and when to use the tool.
											</p>
										</div>
									</div>
									<div className='flex flex-col gap-4 border border-border bg-background rounded-lg px-4 py-6'>
										<FormField
											control={form.control}
											name='description'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description (optional)</FormLabel>
													<FormControl>
														<Textarea
															className='resize-none h-[25vh]'
															placeholder='Leave blank to use the default optimized LLM prompt.'
															value={field.value}
															onChange={field.onChange}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
								<div className='grid rounded-lg bg-primary-foreground p-4'>
									<div className='flex justify-between items-center'>
										<div className='flex flex-col gap-1'>
											<h1 className='text-lg font-medium text-white'>
												Human Transfer Rules
											</h1>
											<p className='mb-4 text-sm text-primary/50'>
												Define the conditions for transferring to human
												operators.
											</p>
										</div>
										<Button
											variant='outline'
											onClick={() =>
												append({
													condition: '',
													phone_number: '',
												})
											}
											className='w-max bg-background'
										>
											Add Rule
										</Button>
									</div>
									<div className='flex flex-col gap-2'>
										{fields.map((_, index) => (
											<div
												className='flex flex-col gap-4 border-border border bg-background rounded-lg px-4 py-6'
												key={index}
											>
												<FormField
													control={form.control}
													name={`transfers.${index}.phone_number`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Phone Number</FormLabel>
															<FormControl>
																<PhoneInput
																	placeholder='+61 2 1234-5678'
																	defaultCountry='AU'
																	type='text'
																	value={field.value}
																	onChange={field.onChange}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`transfers.${index}.condition`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Condition</FormLabel>
															<FormControl>
																<Textarea
																	className='resize-none h-[25vh]'
																	placeholder='Enter the condition for transferring to this phone number'
																	value={field.value}
																	onChange={field.onChange}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<div className='flex items-center justify-end'>
													<Button
														variant='outline'
														onClick={() => remove(index)}
													>
														Delete
													</Button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</ScrollArea>
						<SheetFooter>
							<div className='flex justify-end gap-2 items-center'>
								<Button type='button' variant='outline' className='w-max'>
									Cancel
								</Button>
								<Button
									type='submit'
									disabled={form.formState.isSubmitting}
									className='w-max'
								>
									{form.formState.isSubmitting ? (
										<LoaderCircle className='size-4 animate-spin' />
									) : (
										'Add'
									)}
								</Button>
							</div>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
