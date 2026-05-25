import type { ConversationalConfig } from '@elevenlabs/elevenlabs-js/api'
import { TtsOutputFormat as AudioFormat } from '@elevenlabs/elevenlabs-js/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { LoaderCircle, TriangleAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { SelectSetting } from '@/components/project-settings/select-setting'
import { SelectVoice } from '@/components/project-settings/select-voice'
import { SliderSetting } from '@/components/project-settings/slider-setting'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useUpdateAgent } from '@/hooks/use-update-agent'

const formSchema = z.object({
	similarity: z.number(),
	stability: z.number(),
	speed: z.number(),
	voice_id: z.string(),
	audio_format: z.string(),
})

export function VoiceForm({
	conversation_config,
	agent_id,
}: {
	conversation_config: ConversationalConfig
	agent_id: string
}) {
	const updateAgent = useUpdateAgent(agent_id)
	const queryClient = useQueryClient()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			similarity: conversation_config.tts?.similarityBoost,
			stability: conversation_config.tts?.stability,
			speed: conversation_config.tts?.speed,
			voice_id: conversation_config.tts?.voiceId,
			audio_format: conversation_config.tts
				?.agentOutputAudioFormat as AudioFormat,
		},
	})
	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await updateAgent.mutateAsync(
				{
					tts: {
						voiceId: values.voice_id,
						speed: values.speed,
						stability: values.stability,
						similarityBoost: values.similarity,
						agentOutputAudioFormat: values.audio_format as AudioFormat,
					},
				},
				{
					onSuccess(data) {
						queryClient.invalidateQueries({ queryKey: [agent_id] })
						form.reset(
							{
								similarity: data.conversationConfig.tts?.similarityBoost,
								stability: data.conversationConfig.tts?.stability,
								speed: data.conversationConfig.tts?.speed,
								voice_id: data.conversationConfig.tts?.voiceId,
								audio_format: data.conversationConfig.tts
									?.agentOutputAudioFormat as AudioFormat,
							},
							{ keepValues: true },
						)
					},
				},
			)
			return toast.success('Agent updated successfully')
		} catch (_err) {
			return toast.error('Error while updating agent')
		}
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='mb-60 space-y-4'>
				<FormField
					control={form.control}
					name='voice_id'
					render={({ field: { value, onChange } }) => (
						<FormItem>
							<FormControl>
								<SelectVoice value={value} onChange={e => onChange(e)} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='similarity'
					render={({ field: { value, onChange } }) => (
						<FormItem>
							<FormControl>
								<SliderSetting
									title='Similarity'
									description='Higher values will boost the overall clarity and consistency of the voice. Very high values may lead to artifacts. Adjusting this value to find the right balance is recommended.'
									min={0}
									max={1}
									step={0.05}
									defaultValue={form.getValues('similarity')}
									value={value}
									onChange={([val]) => onChange(val)}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='speed'
					render={({ field: { value, onChange } }) => (
						<FormItem>
							<FormControl>
								<SliderSetting
									title='Speed'
									description='Controls the speed of the generated speech. Values below 1.0 will slow down the speech, while values above 1.0 will speed it up. Extreme values may affect the quality of the generated speech.'
									min={0.7}
									max={1.2}
									step={0.01}
									defaultValue={form.getValues('speed')}
									value={value}
									onChange={([val]) => onChange(val)}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='stability'
					render={({ field: { value, onChange } }) => (
						<FormItem>
							<FormControl>
								<SliderSetting
									title='Stability'
									description='Higher values will make speech more consistent, but it can also make it sound monotone. Lower values will make speech sound more expressive, but may lead to instabilities.'
									min={0}
									max={1}
									step={0.05}
									defaultValue={form.getValues('stability')}
									value={value}
									onChange={([val]) => onChange(val)}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='audio_format'
					render={({ field: { value, onChange } }) => (
						<FormItem>
							<FormControl>
								<Select
									value={value as AudioFormat}
									onValueChange={e => onChange(e as AudioFormat)}
								>
									<FormControl>
										<SelectSetting
											title='TTS output format'
											description='Select the output format you want to use for ElevenLabs text to speech.'
											className='w-full'
										>
											<SelectTrigger id='llm-model' className='w-full'>
												<SelectValue
													placeholder='Select model'
													className='w-full'
												/>
											</SelectTrigger>
										</SelectSetting>
									</FormControl>
									<SelectContent>
										{Object.values(AudioFormat).map(format => (
											<SelectItem key={format} value={format}>
												{format}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
						</FormItem>
					)}
				/>
				{form.formState.isDirty && (
					<div className='sticky bottom-6 flex w-full items-center justify-between rounded-lg border border-border bg-background p-4'>
						<div className='flex gap-2'>
							<TriangleAlert className='size-4' />
							<p className='font-semibold text-sm'>Changes Detected</p>
						</div>
						<div className='flex items-center gap-2'>
							<Button
								className='font-semibold text-sm'
								variant='ghost'
								type='reset'
								onClick={() => form.reset()}
							>
								clear
							</Button>
							<Button type='submit' className='font-semibold text-sm' size='sm'>
								{form.formState.isSubmitting ? (
									<LoaderCircle className='m-1 size-4 animate-spin' />
								) : (
									'save'
								)}
							</Button>
						</div>
					</div>
				)}
			</form>
		</Form>
	)
}
