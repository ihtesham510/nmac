import { SelectSetting } from '@/components/project-settings/select-setting'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useQuery as useTanstackQuery } from '@tanstack/react-query'
import { queries } from '@/api/query-options'
import { useElevenLabsClient } from '@/api/client'
import { Check, ChevronsUpDownIcon, PauseIcon, PlayIcon } from 'lucide-react'
import { type Voice } from 'elevenlabs/api'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useProjetSettings } from '@/context/project-setting-context'
import { LoaderComponent } from '@/components/loader'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDialog } from '@/hooks/use-dialogs'

export const Route = createFileRoute('/dashboard/project-settings/voice')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agent } = useProjetSettings()
	const [dialogs, setDialogs] = useDialog({
		popover: false,
	})
	const client = useElevenLabsClient()
	const voices = useTanstackQuery(queries.list_voices(client))

	const [selectedVoice, setSelectedVoice] = useState<string | undefined>()
	const [selectedVoiceData, setSelectedVoiceData] = useState<
		Voice | undefined
	>()

	const [audio, setAudio] = useState<{
		audio: string
		voice_id: string
		playing: boolean
	} | null>()

	const [testAudioPlaying, setTestAudioPlaying] = useState<boolean>(false)

	const audioRef = useRef<HTMLAudioElement | null>(null)
	const testAudioRef = useRef<HTMLAudioElement | null>(null)

	function playAudio(url: string, voice_id: string) {
		if (audioRef.current && audio && audio.playing) {
			if (audio.voice_id === voice_id) {
				audioRef.current.pause()
				setAudio(prev => (prev ? { ...prev, playing: false } : null))
				return
			}
			audioRef.current.pause()
			audioRef.current.currentTime = 0
			setAudio(prev =>
				prev && prev.playing ? { ...prev, playing: false } : null,
			)
		}
		const newAudio = new Audio(url)
		newAudio.play()
		setAudio({ audio: url, voice_id, playing: true })
		audioRef.current = newAudio
		audioRef.current.onended = () => {
			setAudio(null)
			audioRef.current = null
		}
	}

	function testAudio() {
		if (selectedVoiceData) {
			if (testAudioRef.current && testAudioPlaying) {
				testAudioRef.current.pause()
				testAudioRef.current = null
				setTestAudioPlaying(false)
				return
			}
			const audio = new Audio(selectedVoiceData.preview_url)
			testAudioRef.current = audio
			testAudioRef.current.play()
			setTestAudioPlaying(true)
			testAudioRef.current.onended = () => setTestAudioPlaying(false)
		}
	}

	useEffect(() => {
		if (audioRef.current && !dialogs.popover) {
			audioRef.current.pause()
			audioRef.current = null
			setAudio(null)
		}
		if (testAudioRef.current && testAudioPlaying) {
			testAudioRef.current.pause()
			testAudioRef.current = null
			setTestAudioPlaying(false)
		}
		return () => {
			if (audioRef.current) {
				audioRef.current.pause()
				audioRef.current = null
				setAudio(null)
			}

			if (testAudioRef.current) {
				testAudioRef.current.pause()
				testAudioRef.current = null
				setTestAudioPlaying(false)
			}
		}
	}, [dialogs.popover])

	const currentVoiceData = useMemo(() => {
		if (voices.data) {
			return (
				voices.data.voices.find(voice => voice.voice_id === selectedVoice) ??
				undefined
			)
		}
		return undefined
	}, [selectedVoice, voices.data])

	useEffect(() => {
		setSelectedVoice(agent.data?.conversation_config.tts?.voice_id)
	}, [agent])

	useEffect(() => {
		setSelectedVoiceData(currentVoiceData)
	}, [currentVoiceData])

	return (
		<div>
			{agent.isLoading && <LoaderComponent className='h-[50vh]' />}

			{agent.data && !agent.isLoading && (
				<Popover
					open={dialogs.popover}
					onOpenChange={e => setDialogs('popover', e)}
				>
					<SelectSetting
						title='Voice'
						description='Select the ElevenLabs voice you want to use for the agent.'
						className='w-full'
					>
						<PopoverTrigger asChild>
							{selectedVoice && (
								<Button
									variant='outline'
									className='w-full flex justify-between px-2'
								>
									<div className='flex justify-between w-full items-center'>
										<div className='flex gap-2 items-center'>
											<span
												className='p-1 rounded-full bg-primary text-primary-foreground'
												onClick={e => {
													e.stopPropagation()
													testAudio()
												}}
											>
												{testAudioPlaying ? (
													<PauseIcon className='size-3' />
												) : (
													<PlayIcon className='size-3' />
												)}
											</span>
											<p>{selectedVoiceData?.name}</p>
										</div>
										<ChevronsUpDownIcon className='size-3.5' />
									</div>
								</Button>
							)}
						</PopoverTrigger>
					</SelectSetting>
					<PopoverContent className='p-0 max-w-2xl min-w-md'>
						<Command>
							<CommandInput placeholder='Type a command or search...' />
							<CommandList>
								<CommandEmpty>No voices found.</CommandEmpty>
								<CommandGroup>
									<ScrollArea className='h-[280px] pr-1.5'>
										{voices.data &&
											voices.data.voices.map(voice => (
												<CommandItem
													key={voice.voice_id}
													value={voice.name}
													keywords={[
														voice.name ?? '',
														voice.description ?? '',
														...Object.keys(voice.labels ?? {}).map(
															([_, value]) => value,
														),
													]}
													onSelect={() => {
														setSelectedVoice(voice.voice_id)
													}}
													className='flex justify-between'
												>
													<div className='flex items-center gap-2'>
														<span
															className='p-1 group cursor-pointer text-primary-foreground bg-primary rounded-full'
															onClick={e => {
																e.stopPropagation()
																voice.preview_url &&
																	playAudio(voice.preview_url, voice.voice_id)
															}}
														>
															{audio &&
															audio.voice_id === voice.voice_id &&
															audio.playing ? (
																<PauseIcon className='size-3 group-hover:text-muted-foreground' />
															) : (
																<PlayIcon className='size-3 group-hover:text-muted-foreground' />
															)}
														</span>
														<div className='flex flex-col'>
															<span className='font-medium'>{voice.name}</span>
															<span className='text-xs text-muted-foreground'>
																{`${voice.labels?.accent} ${voice.labels?.accent && '•'}`}{' '}
																{voice.labels?.gender} • {voice.category}
															</span>
														</div>
													</div>
													<Check
														className={cn(
															'mr-2 h-4 w-4',
															selectedVoice === voice.voice_id
																? 'opacity-100'
																: 'opacity-0',
														)}
													/>
												</CommandItem>
											))}
									</ScrollArea>
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			)}
		</div>
	)
}
