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
import { Button } from '@/components/ui/button'
import { useQuery as useTanstackQuery } from '@tanstack/react-query'
import { queries } from '@/api/query-options'
import { useElevenLabsClient } from '@/api/client'
import { Check, ChevronsUpDownIcon, PauseIcon, PlayIcon } from 'lucide-react'
import { type Voice } from '@elevenlabs/elevenlabs-js/api'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDialog } from '@/hooks/use-dialogs'

export function SelectVoice(props: {
	value?: string
	onChange?: (e: string) => void
}) {
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
			const audio = new Audio(selectedVoiceData.previewUrl)
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

	useEffect(() => {
		if (selectedVoice && props.onChange) {
			props.onChange(selectedVoice)
		}
	}, [selectedVoice])

	const currentVoiceData = useMemo(() => {
		if (voices.data) {
			return (
				voices.data.voices.find(voice => voice.voiceId === selectedVoice) ??
				undefined
			)
		}
		return undefined
	}, [selectedVoice, voices.data])

	useEffect(() => {
		setSelectedVoice(props.value)
	}, [props.value])

	useEffect(() => {
		setSelectedVoiceData(currentVoiceData)
	}, [currentVoiceData])

	return (
		<div>
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
						{selectedVoice && selectedVoiceData && (
							<Button
								variant='outline'
								className='w-full flex justify-between px-2'
							>
								<div className='flex justify-between w-full items-center'>
									<div className='flex gap-2 items-center min-w-0'>
										<span
											className='p-1 rounded-full inline-block bg-primary text-primary-foreground'
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
										<p className='truncate min-w-0'>
											{selectedVoiceData?.name}
										</p>
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
												key={voice.voiceId}
												value={voice.name}
												keywords={[
													voice.name ?? '',
													voice.description ?? '',
													...Object.keys(voice.labels ?? {}).map(
														([_, value]) => value,
													),
												]}
												onSelect={() => {
													setSelectedVoice(voice.voiceId)
													setDialogs('popover', false)
												}}
												className='flex justify-between'
											>
												<div className='flex items-center gap-2'>
													<span
														className='p-1 group cursor-pointer text-primary-foreground bg-primary rounded-full'
														onClick={e => {
															e.stopPropagation()
															voice.previewUrl &&
																playAudio(voice.previewUrl, voice.voiceId)
														}}
													>
														{audio &&
														audio.voice_id === voice.voiceId &&
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
														selectedVoice === voice.voiceId
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
		</div>
	)
}
