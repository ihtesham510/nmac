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
import { Check, PauseIcon, PlayIcon } from 'lucide-react'
import { type Voice } from 'elevenlabs/api'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useProjetSettings } from '@/context/project-setting-context'
import { LoaderComponent } from '@/components/loader'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/dashboard/project-settings/voice')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agent } = useProjetSettings()
	const [voice, setSelectedVoice] = useState<string | undefined>(
		agent.data?.conversation_config.tts?.voice_id,
	)
	const [voiceData, setVoiceData] = useState<Voice>()

	return (
		<div>
			{agent.isLoading && <LoaderComponent className='h-[50vh]' />}

			{agent.data && !agent.isLoading && (
				<Popover>
					<SelectSetting
						title='Voice'
						description='Select the ElevenLabs voice you want to use for the agent.'
						className='w-full'
					>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								className='w-full flex justify-between px-4'
							>
								{voiceData && (
									<div className='flex justify-between items-center'>
										<Button variant='ghost' size='icon'>
											<PlayIcon className='size-4' />
										</Button>
										<p>{voiceData?.name}</p>
									</div>
								)}
							</Button>
						</PopoverTrigger>
					</SelectSetting>
					<PopoverContent className='p-0 max-w-2xl min-w-md'>
						<Command>
							<CommandInput placeholder='Type a command or search...' />
							<VoicesList
								value={voice!}
								onChange={e => setSelectedVoice(e)}
								getVoiceData={e => setVoiceData(e)}
							/>
						</Command>
					</PopoverContent>
				</Popover>
			)}
		</div>
	)
}

function VoicesList({
	value,
	onChange,
	getVoiceData,
}: {
	value: string
	onChange: (e: string) => void
	getVoiceData: (e?: Voice) => void
}) {
	const [audio, setAudio] = useState<{
		audio: string
		voice_id: string
		playing: boolean
	} | null>()
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const client = useElevenLabsClient()
	const voices = useTanstackQuery(queries.list_voices(client))

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
	useEffect(() => {
		return () => {
			if (audioRef.current) {
				audioRef.current.pause()
				audioRef.current = null
				setAudio(null)
			}
		}
	}, [])

	useEffect(() => {
		if (getVoiceData && voices.data) {
			getVoiceData(voices.data.voices.find(voice => value === voice.voice_id))
		}
	}, [voices.data?.voices, value])

	return (
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
									...Object.keys(voice.labels ?? {}).map(([_, value]) => value),
								]}
								onSelect={() => {
									onChange && onChange(voice.voice_id)
								}}
								className='flex justify-between'
							>
								<div className='flex items-center gap-2'>
									<span
										className='p-1 group cursor-pointer'
										onClick={e => {
											e.stopPropagation()
											voice.preview_url &&
												playAudio(voice.preview_url, voice.voice_id)
										}}
									>
										{audio &&
										audio.voice_id === voice.voice_id &&
										audio.playing ? (
											<PauseIcon className='size-4 group-hover:text-muted-foreground' />
										) : (
											<PlayIcon className='size-4 group-hover:text-muted-foreground' />
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
										value === voice.voice_id ? 'opacity-100' : 'opacity-0',
									)}
								/>
							</CommandItem>
						))}
				</ScrollArea>
			</CommandGroup>
		</CommandList>
	)
}
