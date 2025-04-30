import { AgentSelect } from '@/components/select-agent'
import { ProtectedClientRoute } from '@/hoc/protected-client-route'
import { useAgents } from '@/hooks/use-agents'
import type { Agent } from '@/lib/types'
import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/dashboard/project-setttings')({
	component: () => (
		<ProtectedClientRoute>
			<RouteComponent />
		</ProtectedClientRoute>
	),
})

function RouteComponent() {
	const agents = useAgents()
	const [selectedAgent, setSelectedAgent] = React.useState<Agent>(agents[0])

	return (
		<div className='w-full h-screen'>
			<AgentSelect
				agents={agents}
				value={selectedAgent}
				className='w-[200px]'
				placeholder='All Agents'
				onSelect={agent => setSelectedAgent(agent)}
			/>
		</div>
	)
}

;('use client')

import { useState } from 'react'
import { ArrowLeft, Info, Save } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

// Sample agent data
const agentData = {
	id: 'agent_123456',
	name: 'Customer Support Agent',
	conversation_config: {
		tts: {
			model_id: 'eleven_turbo_v2',
			voice_id: 'cjVigY5qzO86Huf0OWal',
			agent_output_audio_format: 'pcm_16000',
			optimize_streaming_latency: 3,
			stability: 0.5,
			speed: 1,
			similarity_boost: 0.8,
		},
		conversation: {
			max_duration_seconds: 600,
			client_events: ['audio', 'interruption'],
		},
		agent: {
			first_message: 'Hello, how can I help you today?',
			language: 'en',
			prompt: {
				prompt:
					'You are a helpful assistant that can answer questions about the topic of the conversation.',
				llm: 'gemini-2.0-flash-001',
				temperature: 0,
			},
		},
	},
}

// Sample voices
const sampleVoices = [
	{
		id: 'cjVigY5qzO86Huf0OWal',
		name: 'Emma',
		description: 'Friendly and professional female voice',
	},
	{
		id: 'XrExE9yKIg1WjnnlVkGX',
		name: 'Thomas',
		description: 'Deep and authoritative male voice',
	},
	{
		id: 'pNInz6obpgDQGcFmaJgB',
		name: 'Alex',
		description: 'Neutral and clear voice',
	},
	{
		id: 'jBpfuIE2acCO8z3wKNLl',
		name: 'Sophia',
		description: 'Warm and engaging female voice',
	},
]

// Sample audio formats with descriptions
const audioFormats = [
	{
		id: 'pcm_16000',
		name: 'PCM 16kHz',
		description:
			'Raw PCM audio at 16kHz sample rate. Good balance of quality and size.',
	},
	{
		id: 'pcm_22050',
		name: 'PCM 22.05kHz',
		description:
			'Raw PCM audio at 22.05kHz sample rate. Better quality than 16kHz.',
	},
	{
		id: 'pcm_24000',
		name: 'PCM 24kHz',
		description: 'Raw PCM audio at 24kHz sample rate. High quality audio.',
	},
	{
		id: 'mp3_44100',
		name: 'MP3 44.1kHz',
		description:
			'Compressed MP3 audio at 44.1kHz. Good for streaming and storage.',
	},
]

// Sample LLM models
const llmModels = [
	{ id: 'gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
	{ id: 'gemini-2.0-pro-001', name: 'Gemini 2.0 Pro' },
	{ id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
	{ id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
	{ id: 'gpt-4o', name: 'GPT-4o' },
]

// Languages
const languages = [
	{ code: 'en', name: 'English' },
	{ code: 'es', name: 'Spanish' },
	{ code: 'fr', name: 'French' },
	{ code: 'de', name: 'German' },
	{ code: 'it', name: 'Italian' },
	{ code: 'pt', name: 'Portuguese' },
	{ code: 'ja', name: 'Japanese' },
	{ code: 'ko', name: 'Korean' },
	{ code: 'zh', name: 'Chinese' },
]

export default function AgentUpdatePage() {
	const [agent, setAgent] = useState(agentData)

	const handleSave = () => {
		console.log('Saving agent:', agent)
		// This would typically send the data to the server
	}

	const updateAgentField = (path: string[], value: any) => {
		setAgent(prevAgent => {
			const newAgent = { ...prevAgent }
			let current: any = newAgent

			// Navigate to the nested property
			for (let i = 0; i < path.length - 1; i++) {
				current = current[path[i]]
			}

			// Update the value
			current[path[path.length - 1]] = value
			return newAgent
		})
	}

	return (
		<div className='container py-8'>
			<div className='flex items-center justify-between mb-6'>
				<div className='flex items-center gap-4'>
					<Link to='/'>
						<Button variant='outline' size='icon' className='h-8 w-8'>
							<ArrowLeft className='h-4 w-4' />
						</Button>
					</Link>
					<h1 className='text-2xl font-bold'>Update Agent</h1>
					<Badge variant='outline' className='ml-2'>
						{agent.id}
					</Badge>
				</div>
				<Button onClick={handleSave}>
					<Save className='h-4 w-4 mr-2' />
					Save Changes
				</Button>
			</div>

			<div className='mb-6'>
				<Label htmlFor='agent-name'>Agent Name</Label>
				<Input
					id='agent-name'
					value={agent.name}
					onChange={e => setAgent({ ...agent, name: e.target.value })}
					className='max-w-md'
				/>
			</div>

			<Tabs defaultValue='general' className='w-full'>
				<TabsList className='mb-4'>
					<TabsTrigger value='general'>General</TabsTrigger>
					<TabsTrigger value='voices'>Voices</TabsTrigger>
				</TabsList>

				<TabsContent value='general'>
					<Card>
						<CardContent className='pt-6'>
							<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
								{/* Left column - Prompt */}
								<div className='lg:col-span-2'>
									<div className='space-y-4'>
										<div>
											<Label htmlFor='prompt' className='text-base font-medium'>
												Agent Prompt
											</Label>
											<Textarea
												id='prompt'
												value={agent.conversation_config.agent.prompt.prompt}
												onChange={e =>
													updateAgentField(
														[
															'conversation_config',
															'agent',
															'prompt',
															'prompt',
														],
														e.target.value,
													)
												}
												className='min-h-[300px] font-mono text-sm'
												placeholder="Enter the agent's prompt here..."
											/>
										</div>

										<div>
											<Label
												htmlFor='first-message'
												className='text-base font-medium'
											>
												First Message
											</Label>
											<Textarea
												id='first-message'
												value={agent.conversation_config.agent.first_message}
												onChange={e =>
													updateAgentField(
														['conversation_config', 'agent', 'first_message'],
														e.target.value,
													)
												}
												className='min-h-[100px]'
												placeholder="Enter the agent's first message..."
											/>
										</div>
									</div>
								</div>

								{/* Right column - Options */}
								<div className='space-y-6'>
									<div className='space-y-4'>
										<h3 className='text-base font-medium'>Model Settings</h3>

										<div className='space-y-2'>
											<Label htmlFor='llm-model'>LLM Model</Label>
											<Select
												value={agent.conversation_config.agent.prompt.llm}
												onValueChange={value =>
													updateAgentField(
														['conversation_config', 'agent', 'prompt', 'llm'],
														value,
													)
												}
											>
												<SelectTrigger id='llm-model'>
													<SelectValue placeholder='Select model' />
												</SelectTrigger>
												<SelectContent>
													{llmModels.map(model => (
														<SelectItem key={model.id} value={model.id}>
															{model.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<Label htmlFor='temperature'>Temperature</Label>
												<span className='text-sm text-muted-foreground'>
													{agent.conversation_config.agent.prompt.temperature}
												</span>
											</div>
											<Slider
												id='temperature'
												min={0}
												max={1}
												step={0.1}
												value={[
													agent.conversation_config.agent.prompt.temperature,
												]}
												onValueChange={value =>
													updateAgentField(
														[
															'conversation_config',
															'agent',
															'prompt',
															'temperature',
														],
														value[0],
													)
												}
											/>
										</div>

										<div className='space-y-2'>
											<Label htmlFor='language'>Language</Label>
											<Select
												value={agent.conversation_config.agent.language}
												onValueChange={value =>
													updateAgentField(
														['conversation_config', 'agent', 'language'],
														value,
													)
												}
											>
												<SelectTrigger id='language'>
													<SelectValue placeholder='Select language' />
												</SelectTrigger>
												<SelectContent>
													{languages.map(language => (
														<SelectItem
															key={language.code}
															value={language.code}
														>
															{language.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									<div className='space-y-4'>
										<h3 className='text-base font-medium'>
											Conversation Settings
										</h3>

										<div className='space-y-2'>
											<Label htmlFor='max-duration'>
												Max Duration (seconds)
											</Label>
											<Input
												id='max-duration'
												type='number'
												value={
													agent.conversation_config.conversation
														.max_duration_seconds
												}
												onChange={e =>
													updateAgentField(
														[
															'conversation_config',
															'conversation',
															'max_duration_seconds',
														],
														Number.parseInt(e.target.value),
													)
												}
											/>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='voices'>
					<Card>
						<CardContent className='pt-6'>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
								<div className='space-y-6'>
									<div className='space-y-4'>
										<h3 className='text-base font-medium'>Voice Settings</h3>

										<div className='space-y-2'>
											<Label htmlFor='tts-model'>TTS Model</Label>
											<Select
												value={agent.conversation_config.tts.model_id}
												onValueChange={value =>
													updateAgentField(
														['conversation_config', 'tts', 'model_id'],
														value,
													)
												}
											>
												<SelectTrigger id='tts-model'>
													<SelectValue placeholder='Select TTS model' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='eleven_turbo_v2'>
														Eleven Turbo v2
													</SelectItem>
													<SelectItem value='eleven_multilingual_v2'>
														Eleven Multilingual v2
													</SelectItem>
													<SelectItem value='eleven_monolingual_v1'>
														Eleven Monolingual v1
													</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div className='space-y-2'>
											<Label htmlFor='voice'>Voice</Label>
											<Select
												value={agent.conversation_config.tts.voice_id}
												onValueChange={value =>
													updateAgentField(
														['conversation_config', 'tts', 'voice_id'],
														value,
													)
												}
											>
												<SelectTrigger id='voice'>
													<SelectValue placeholder='Select voice' />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectLabel>Available Voices</SelectLabel>
														{sampleVoices.map(voice => (
															<SelectItem key={voice.id} value={voice.id}>
																<div className='flex flex-col'>
																	<span>{voice.name}</span>
																	<span className='text-xs text-muted-foreground'>
																		{voice.description}
																	</span>
																</div>
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										</div>

										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<Label htmlFor='audio-format'>Audio Format</Label>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															variant='ghost'
															size='icon'
															className='h-6 w-6'
														>
															<Info className='h-4 w-4' />
															<span className='sr-only'>
																Audio format information
															</span>
														</Button>
													</PopoverTrigger>
													<PopoverContent className='w-80'>
														<div className='space-y-2'>
															<h4 className='font-medium'>
																About Audio Formats
															</h4>
															<p className='text-sm text-muted-foreground'>
																Different audio formats offer various trade-offs
																between quality, file size, and compatibility.
															</p>
														</div>
													</PopoverContent>
												</Popover>
											</div>
											<Select
												value={
													agent.conversation_config.tts
														.agent_output_audio_format
												}
												onValueChange={value =>
													updateAgentField(
														[
															'conversation_config',
															'tts',
															'agent_output_audio_format',
														],
														value,
													)
												}
											>
												<SelectTrigger id='audio-format'>
													<SelectValue placeholder='Select audio format' />
												</SelectTrigger>
												<SelectContent>
													{audioFormats.map(format => (
														<SelectItem key={format.id} value={format.id}>
															<div className='flex flex-col'>
																<span>{format.name}</span>
																<span className='text-xs text-muted-foreground'>
																	{format.description}
																</span>
															</div>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
								</div>

								<div className='space-y-6'>
									<div className='space-y-4'>
										<h3 className='text-base font-medium'>Voice Tuning</h3>

										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<Label htmlFor='stability'>Stability</Label>
												<span className='text-sm text-muted-foreground'>
													{agent.conversation_config.tts.stability}
												</span>
											</div>
											<Slider
												id='stability'
												min={0}
												max={1}
												step={0.1}
												value={[agent.conversation_config.tts.stability]}
												onValueChange={value =>
													updateAgentField(
														['conversation_config', 'tts', 'stability'],
														value[0],
													)
												}
											/>
											<p className='text-xs text-muted-foreground'>
												Higher values make the voice more consistent but may
												sound less natural.
											</p>
										</div>

										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<Label htmlFor='similarity-boost'>
													Similarity Boost
												</Label>
												<span className='text-sm text-muted-foreground'>
													{agent.conversation_config.tts.similarity_boost}
												</span>
											</div>
											<Slider
												id='similarity-boost'
												min={0}
												max={1}
												step={0.1}
												value={[agent.conversation_config.tts.similarity_boost]}
												onValueChange={value =>
													updateAgentField(
														['conversation_config', 'tts', 'similarity_boost'],
														value[0],
													)
												}
											/>
											<p className='text-xs text-muted-foreground'>
												Higher values make the voice sound more like the
												reference but may reduce quality.
											</p>
										</div>

										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<Label htmlFor='speed'>Speed</Label>
												<span className='text-sm text-muted-foreground'>
													{agent.conversation_config.tts.speed}
												</span>
											</div>
											<Slider
												id='speed'
												min={0.5}
												max={2}
												step={0.1}
												value={[agent.conversation_config.tts.speed]}
												onValueChange={value =>
													updateAgentField(
														['conversation_config', 'tts', 'speed'],
														value[0],
													)
												}
											/>
											<p className='text-xs text-muted-foreground'>
												Adjust the speaking rate of the voice (1.0 is normal
												speed).
											</p>
										</div>

										<div className='space-y-2'>
											<Label htmlFor='latency-optimization'>
												Optimize Streaming Latency
											</Label>
											<Select
												value={agent.conversation_config.tts.optimize_streaming_latency.toString()}
												onValueChange={value =>
													updateAgentField(
														[
															'conversation_config',
															'tts',
															'optimize_streaming_latency',
														],
														Number.parseInt(value),
													)
												}
											>
												<SelectTrigger id='latency-optimization'>
													<SelectValue placeholder='Select optimization level' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='0'>
														Level 0 - No optimization
													</SelectItem>
													<SelectItem value='1'>
														Level 1 - Slight optimization
													</SelectItem>
													<SelectItem value='2'>
														Level 2 - Moderate optimization
													</SelectItem>
													<SelectItem value='3'>
														Level 3 - Significant optimization
													</SelectItem>
													<SelectItem value='4'>
														Level 4 - Maximum optimization
													</SelectItem>
												</SelectContent>
											</Select>
											<p className='text-xs text-muted-foreground'>
												Higher values reduce latency but may affect quality.
											</p>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
