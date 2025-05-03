import type { api } from 'convex/_generated/api'

export type User = (typeof api.user.authenticate)['_returnType']
export type Client = (typeof api.client.authenticate)['_returnType']

export type Clients = (typeof api.client.listClients)['_returnType']

export type ArgsUser = (typeof api.user.registerUser)['_args']
export type ArgsSignIn = (typeof api.user.signIn)['_args']

export type Agent = (typeof api.agents.getAgent)['_returnType']

export enum Models {
	// OpenAI GPT models
	GPT_4O_MINI = 'gpt-4o-mini',
	GPT_4O = 'gpt-4o',
	GPT_4 = 'gpt-4',
	GPT_4_TURBO = 'gpt-4-turbo',
	GPT_4_1 = 'gpt-4.1',
	GPT_4_1_MINI = 'gpt-4.1-mini',
	GPT_4_1_NANO = 'gpt-4.1-nano',
	GPT_3_5_TURBO = 'gpt-3.5-turbo',

	// Google Gemini models
	GEMINI_1_5_PRO = 'gemini-1.5-pro',
	GEMINI_1_5_FLASH = 'gemini-1.5-flash',
	GEMINI_2_0_FLASH_001 = 'gemini-2.0-flash-001',
	GEMINI_2_0_FLASH_LITE = 'gemini-2.0-flash-lite',
	GEMINI_2_5_FLASH = 'gemini-2.5-flash',
	GEMINI_1_0_PRO = 'gemini-1.0-pro',

	// Anthropic Claude models
	CLAUDE_3_7_SONNET = 'claude-3-7-sonnet',
	CLAUDE_3_5_SONNET = 'claude-3-5-sonnet',
	CLAUDE_3_5_SONNET_V1 = 'claude-3-5-sonnet-v1',
	CLAUDE_3_HAIKU = 'claude-3-haiku',

	// xAI Grok model
	GROK_BETA = 'grok-beta',
}

export enum AudioFormat {
	PCM_8000 = 'pcm_8000',
	PCM_16000 = 'pcm_16000',
	PCM_22050 = 'pcm_22050',
	PCM_24000 = 'pcm_24000',
	PCM_44100 = 'pcm_44100',
	PCM_48000 = 'pcm_48000',
	ULAW_8000 = 'ulaw_8000',
}
