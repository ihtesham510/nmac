import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangleIcon, LoaderCircleIcon, WebhookIcon } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import type { GetAgentResponseModel } from 'elevenlabs/api'
import NumberFlow from '@number-flow/react'
import { Slider } from '@/components/ui/slider'
import {
	WebhookToolApiSchemaConfigInputMethod,
	LiteralJsonSchemaPropertyType,
} from 'elevenlabs/api'
import { toast } from 'sonner'
import { useAddWebhook } from '@/hooks/use-add-webhook'

const methods = [
	WebhookToolApiSchemaConfigInputMethod.Get,
	WebhookToolApiSchemaConfigInputMethod.Post,
	WebhookToolApiSchemaConfigInputMethod.Patch,
	WebhookToolApiSchemaConfigInputMethod.Delete,
] as const
const query_params_types = [
	LiteralJsonSchemaPropertyType.String,
	LiteralJsonSchemaPropertyType.Number,
	LiteralJsonSchemaPropertyType.Boolean,
	LiteralJsonSchemaPropertyType.Integer,
] as const

const formSchema = z
	.object({
		name: z
			.string()
			.min(2)
			.regex(/^[a-zA-Z0-9_-]{1,64}$/, {
				message:
					'Must be 1-64 characters long and contain only letters, numbers, underscores, or hyphens',
			}),
		description: z.string().min(8),
		url: z.string().url(),
		method: z.enum(methods),
		request_timeOut: z.number().min(5).max(120),
		headers: z.array(z.object({ name: z.string(), value: z.string() })),
		query_params: z.array(
			z.object({
				type: z.enum(query_params_types),
				identifier: z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/, {
					message:
						'Must be 1-64 characters long and contain only letters, numbers, underscores, or hyphens',
				}),
				description: z.string(),
			}),
		),
		body_params: z.object({
			enabled: z.boolean(),
			description: z.string(),
			properties: z.array(
				z.object({
					type: z.enum(query_params_types),
					identifier: z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/, {
						message:
							'Must be 1-64 characters long and contain only letters, numbers, underscores, or hyphens',
					}),
					description: z.string(),
				}),
			),
		}),
	})
	.refine(
		data => {
			const hasQueryParams = data.query_params.length > 0
			const hasBodyParams = data.body_params.properties.length > 0
			const requiresBody = data.method === 'POST' || data.method === 'PATCH'

			if (!hasQueryParams && requiresBody && !hasBodyParams) {
				return false
			}

			return hasQueryParams || hasBodyParams
		},
		{
			message: 'At least one query parameter or body parameter must be defined',
			path: ['query_params'],
		},
	)
	.refine(
		data => {
			const requiresBody = data.method === 'POST' || data.method === 'PATCH'
			const hasBodyParams = data.body_params.properties.length > 0

			if (
				requiresBody &&
				hasBodyParams &&
				!data.body_params.description.trim()
			) {
				return false
			}

			return true
		},
		{
			message:
				'Body description is required when using body parameters with POST/PATCH methods',
			path: ['body_params', 'description'],
		},
	)

export function AddWebhook({
	open,
	onOpenChange,
	data,
}: {
	open?: boolean
	onOpenChange?: (e: boolean) => void
	data: GetAgentResponseModel
}) {
	const addWebhook = useAddWebhook(data)
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			request_timeOut: 20,
			method: 'GET',
			name: '',
			description: '',
			url: '',
			headers: [],
			query_params: [],
			body_params: {
				enabled: false,
				description: '',
				properties: [],
			},
		},
	})

	const isValidRequest =
		form.watch('method') === 'GET' || form.watch('method') === 'DELETE'

	const query_params = useFieldArray({
		control: form.control,
		name: 'query_params',
	})
	const body_params = useFieldArray({
		control: form.control,
		name: 'body_params.properties',
	})
	const headers = useFieldArray({
		control: form.control,
		name: 'headers',
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const requiresBody = values.method === 'POST' || values.method === 'PATCH'
		const hasQueryParams = values.query_params.length > 0
		const hasBodyParams = values.body_params.properties.length > 0

		const queryParamsSchema = hasQueryParams
			? {
					properties: Object.fromEntries(
						values.query_params.map(param => [
							param.identifier,
							{
								type: param.type,
								description: param.description,
							},
						]),
					),
				}
			: undefined

		const requestBodySchema =
			requiresBody && hasBodyParams
				? {
						description: values.body_params.description,
						properties: Object.fromEntries(
							values.body_params.properties.map(param => [
								param.identifier,
								{
									type: param.type,
									description: param.description,
								},
							]),
						),
					}
				: undefined

		if (!hasQueryParams && !hasBodyParams) {
			toast.error(
				'At least one query parameter or body parameter must be defined',
			)
			return
		}

		if (
			requiresBody &&
			hasBodyParams &&
			!values.body_params.description.trim()
		) {
			toast.error(
				'Body description is required for POST/PATCH methods with body parameters',
			)
			return
		}

		console.log('Submitting webhook with values:', {
			...values,
			queryParamsSchema,
			requestBodySchema,
		})

		try {
			await addWebhook.mutateAsync(
				{
					name: values.name,
					description: values.description,
					api_schema: {
						url: values.url,
						method: values.method,
						...(queryParamsSchema && {
							query_params_schema: queryParamsSchema,
						}),
						...(requestBodySchema && {
							request_body_schema: requestBodySchema,
						}),
						request_headers: Object.fromEntries(
							values.headers.map(header => [header.name, header.value]),
						),
					},
				},
				{
					onSuccess() {
						toast.success('Webhook tool added successfully.')
						form.reset()
						onOpenChange?.(false)
					},
					onError(error) {
						console.error('Webhook creation error:', error)
						toast.error('Error while adding webhook tool')
					},
				},
			)
		} catch (error) {
			console.error('Webhook submission error:', error)
			toast.error('Error while adding webhook tool')
		}
	}

	return (
		<Sheet onOpenChange={onOpenChange} open={open}>
			<SheetContent className='w-full sm:max-w-md md:max-w-xl'>
				<SheetHeader>
					<SheetTitle className='flex gap-4 items-center'>
						<Button variant='secondary' size='icon' type='button'>
							<WebhookIcon className='size-4' />
						</Button>{' '}
						Add Tool
					</SheetTitle>
				</SheetHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<ScrollArea className='h-[70vh] px-2 mx-2'>
							<div className='flex flex-col gap-4 mb-10'>
								<div className='grid rounded-lg bg-primary-foreground p-4'>
									<div className='flex justify-between items-center m-2'>
										<div className='flex flex-col gap-1'>
											<h1 className='text-lg font-medium text-white'>
												Configuration
											</h1>
											<p className='mb-4 text-sm text-primary/50'>
												Describe to the LLM how and when to use the tool.
											</p>
										</div>
									</div>
									<div className='flex flex-col border border-border space-y-6 bg-background rounded-lg px-4 py-6'>
										<FormField
											control={form.control}
											name='name'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Name</FormLabel>
													<FormControl>
														<Input
															className='w-full'
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
											name='description'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description</FormLabel>
													<FormControl>
														<Textarea
															className='resize-none h-[25vh]'
															value={field.value}
															onChange={field.onChange}
														/>
													</FormControl>
													<FormMessage />
													<FormDescription>
														This field will be passed to the LLM and should
														describe in detail how to extract the data from the
														transcript.
													</FormDescription>
												</FormItem>
											)}
										/>
										<div className='flex gap-4'>
											<div className='grid gap-2'>
												<FormField
													control={form.control}
													name='method'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Method</FormLabel>
															<FormControl>
																<Select
																	value={field.value}
																	onValueChange={field.onChange}
																>
																	<SelectTrigger className='w-[120px]'>
																		<SelectValue placeholder='Method' />
																	</SelectTrigger>
																	<SelectContent>
																		{methods.map((method, i) => (
																			<SelectItem key={i} value={method}>
																				{method}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
											<div className='grid gap-2 w-full'>
												<FormField
													control={form.control}
													name='url'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Url</FormLabel>
															<FormControl>
																<Input
																	className='w-full'
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
										<div className='mb-2 flex justify-between items-center text-xs'>
											<div className='flex flex-col gap-1.5'>
												<div className='flex justify-between items-center'>
													<h3 className='text-base font-normal text-white'>
														Request Timeout (Seconds)
													</h3>
													<p className='font-semibold text-[1rem]'>
														<NumberFlow value={form.watch('request_timeOut')} />
													</p>
												</div>
												<p className='text-primary/50'>
													How long to wait for the client tool to respond before
													timing out. Default is 20 seconds.
												</p>
											</div>
										</div>
										<FormField
											control={form.control}
											name='request_timeOut'
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Slider
															className='my-4'
															defaultValue={[20]}
															max={120}
															step={5}
															onValueChange={e => field.onChange(e[0])}
															value={[field.value]}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
								</div>
								<div className='grid rounded-lg bg-primary-foreground p-4'>
									<div className='flex justify-between items-center m-2'>
										<div className='flex flex-col gap-1'>
											<h1 className='text-lg font-medium text-white'>
												Headers
											</h1>
											<p className='mb-4 text-sm text-primary/50'>
												Define headers that will be sent with the request
											</p>
										</div>
										<Button
											variant='outline'
											type='button'
											onClick={() =>
												headers.append({
													name: '',
													value: '',
												})
											}
											className='w-max ml-4 bg-background'
										>
											Add header
										</Button>
									</div>
									<div className='flex flex-col gap-2'>
										{headers.fields.map((_, index) => (
											<div
												key={index}
												className='flex flex-col space-y-4 bg-background p-4 rounded-lg'
											>
												<FormField
													control={form.control}
													name={`headers.${index}.name`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Name</FormLabel>
															<FormControl>
																<Input {...field} />
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`headers.${index}.value`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Value</FormLabel>
															<FormControl>
																<Input {...field} />
															</FormControl>
														</FormItem>
													)}
												/>
												<div className='flex justify-end items-center'>
													<Button
														variant='outline'
														type='button'
														onClick={() => headers.remove(index)}
													>
														Delete
													</Button>
												</div>
											</div>
										))}
									</div>
								</div>
								{/* Query Parameters */}
								<div className='grid rounded-lg bg-primary-foreground p-4'>
									<div className='flex justify-between items-center m-2'>
										<div className='flex flex-col gap-1'>
											<h1 className='text-lg font-medium text-white'>
												Query parameters
											</h1>
											<p className='mb-4 text-sm text-primary/50'>
												Define parameters that will be collected by the LLM and
												sent as query parameters in the URL.
											</p>
										</div>
										<Button
											variant='outline'
											type='button'
											onClick={() =>
												query_params.append({
													type: 'string',
													description: '',
													identifier: '',
												})
											}
											className='w-max ml-4 bg-background'
										>
											Add Params
										</Button>
									</div>
									<div className='flex flex-col gap-2'>
										{query_params.fields.map((_, index) => (
											<div
												key={index}
												className='flex flex-col space-y-4 bg-background p-4 rounded-lg'
											>
												<div className='flex gap-4 w-full'>
													<FormField
														control={form.control}
														name={`query_params.${index}.type`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Type</FormLabel>
																<FormControl>
																	<Select
																		value={field.value}
																		onValueChange={field.onChange}
																	>
																		<SelectTrigger className='w-[120px]'>
																			<SelectValue placeholder='Type' />
																		</SelectTrigger>
																		<SelectContent>
																			{query_params_types.map((type, i) => (
																				<SelectItem key={i} value={type}>
																					{type.charAt(0).toUpperCase() +
																						type.slice(1)}
																				</SelectItem>
																			))}
																		</SelectContent>
																	</Select>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`query_params.${index}.identifier`}
														render={({ field }) => (
															<FormItem className='w-full'>
																<FormLabel>Name</FormLabel>
																<FormControl>
																	<Input {...field} className='w-full' />
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>

												<FormField
													control={form.control}
													name={`query_params.${index}.description`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Description</FormLabel>
															<FormControl>
																<Textarea
																	{...field}
																	className='resize-none h-[8vh]'
																/>
															</FormControl>
															<FormDescription>
																This field will be passed to the LLM and should
																describe in detail how to extract the data from
																the transcript.
															</FormDescription>
														</FormItem>
													)}
												/>
												<div className='flex justify-end items-center'>
													<Button
														variant='outline'
														type='button'
														onClick={() => query_params.remove(index)}
													>
														Delete
													</Button>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Body Parameters */}
								{!isValidRequest && (
									<div className='grid rounded-lg bg-primary-foreground p-4'>
										<div className='flex justify-between items-center m-2'>
											<div className='flex flex-col gap-1'>
												<h1 className='text-lg font-medium text-white'>
													Body Parameters
												</h1>
												<p className='mb-4 text-sm text-primary/50'>
													Define parameters that will be collected by the LLM
													and sent as the body of the request.
												</p>
											</div>
											<Button
												variant='outline'
												type='button'
												onClick={() =>
													body_params.append({
														type: 'string',
														description: '',
														identifier: '',
													})
												}
												className='w-max ml-4 bg-background'
											>
												Add params
											</Button>
										</div>
										<div className='flex flex-col gap-2'>
											<div className='bg-background p-4 rounded-lg'>
												<FormField
													control={form.control}
													name='body_params.description'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Body Description</FormLabel>
															<FormControl>
																<Textarea
																	{...field}
																	className='resize-none h-[15vh]'
																	placeholder='Describe the overall purpose of the request body...'
																/>
															</FormControl>
															<FormDescription>
																This field will be passed to the LLM and should
																describe in detail the purpose of the request
																body. Required for POST/PATCH methods.
															</FormDescription>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
											{body_params.fields.map((_, index) => (
												<div
													key={index}
													className='flex flex-col space-y-4 bg-background p-4 rounded-lg'
												>
													<div className='flex gap-4 w-full'>
														<FormField
															control={form.control}
															name={`body_params.properties.${index}.type`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Type</FormLabel>
																	<FormControl>
																		<Select
																			value={field.value}
																			onValueChange={field.onChange}
																		>
																			<SelectTrigger className='w-[120px]'>
																				<SelectValue placeholder='Type' />
																			</SelectTrigger>
																			<SelectContent>
																				{query_params_types.map((type, i) => (
																					<SelectItem key={i} value={type}>
																						{type.charAt(0).toUpperCase() +
																							type.slice(1)}
																					</SelectItem>
																				))}
																			</SelectContent>
																		</Select>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`body_params.properties.${index}.identifier`}
															render={({ field }) => (
																<FormItem className='w-full'>
																	<FormLabel>Name</FormLabel>
																	<FormControl>
																		<Input {...field} className='w-full' />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>

													<FormField
														control={form.control}
														name={`body_params.properties.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Description</FormLabel>
																<FormControl>
																	<Textarea
																		{...field}
																		className='resize-none h-[8vh]'
																	/>
																</FormControl>
																<FormDescription>
																	This field will be passed to the LLM and
																	should describe in detail how to extract the
																	data from the transcript.
																</FormDescription>
															</FormItem>
														)}
													/>
													<div className='flex justify-end items-center'>
														<Button
															variant='outline'
															type='button'
															onClick={() => body_params.remove(index)}
														>
															Delete
														</Button>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Validation Warning */}
								{form.watch('query_params').length === 0 &&
									form.watch('body_params.properties').length === 0 && (
										<div className='bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4'>
											<p className='text-yellow-500 text-sm flex items-center gap-4 p-2'>
												<AlertTriangleIcon className='size-8' />
												At least one query parameter or body parameter must be
												defined for the webhook to function properly.
											</p>
										</div>
									)}

								{!isValidRequest &&
									form.watch('body_params.properties').length > 0 &&
									!form.watch('body_params.description').trim() && (
										<div className='bg-red-500/10 border border-red-500/20 rounded-lg p-4'>
											<p className='text-red-500 text-sm'>
												⚠️ Body description is required when using body
												parameters with POST/PATCH methods.
											</p>
										</div>
									)}
							</div>
						</ScrollArea>
						<SheetFooter>
							<div className='flex justify-end items-center gap-4'>
								<Button
									onClick={() => onOpenChange?.(false)}
									variant='outline'
									type='button'
								>
									Cancel
								</Button>
								<Button type='submit' disabled={form.formState.isSubmitting}>
									{form.formState.isSubmitting ? (
										<LoaderCircleIcon className='size-4 animate-spin' />
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
