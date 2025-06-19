import { queryOptions } from '@tanstack/react-query'
import { type ConversationSummaryResponseModel } from '@elevenlabs/elevenlabs-js/api'
import type { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'

export const queries = {
	list_agents: (client: ElevenLabsClient) =>
		queryOptions({
			queryKey: ['list_agents'],
			queryFn: async () => await client.conversationalAi.agents.list(),
		}),
	get_conversation_audio: (api_key: string, conversationId: string) =>
		queryOptions({
			queryKey: ['get_conversation_audio', conversationId],
			queryFn: async () => {
				const res = await fetch(
					`https://api.elevenlabs.io/v1/convai/conversations/${conversationId}/audio`,
					{ method: 'GET', headers: { 'xi-api-key': api_key } },
				)
				return await res.blob()
			},
		}),
	list_conversations: (
		client: ElevenLabsClient,
		{
			agent_id,
			filter,
		}: {
			agent_id?: string
			filter: string[]
		},
	) =>
		queryOptions({
			queryKey: ['list_conversations', agent_id, filter],
			queryFn: async () => {
				let conversations: ConversationSummaryResponseModel[] = []
				let cursor: string | undefined = undefined
				do {
					const conv = await client.conversationalAi.conversations.list({
						agentId: agent_id,
						pageSize: 100,
						cursor: cursor,
					})
					cursor = conv.nextCursor
					conversations = [...conversations, ...conv.conversations]
				} while (cursor)
				conversations = conversations.filter(conv =>
					filter.includes(conv.agentId),
				)
				return { conversations }
			},
		}),
	get_agent: (
		client: ElevenLabsClient,
		{ id, enabled }: { id?: string; enabled: boolean },
	) =>
		queryOptions({
			queryKey: ['get_agent', id],
			queryFn: async () =>
				id ? await client.conversationalAi.agents.get(id) : null,
			enabled,
			refetchOnWindowFocus: false,
		}),
	get_conversation: (
		client: ElevenLabsClient,
		{
			conversationId,
			enabled,
		}: {
			conversationId: string
			enabled: boolean
		},
	) =>
		queryOptions({
			queryKey: ['get_conversation', conversationId],
			queryFn: async () =>
				await client.conversationalAi.conversations.get(conversationId),
			enabled,
		}),
	list_phone_no: (
		client: ElevenLabsClient,
		{ filter }: { filter?: string[] },
	) =>
		queryOptions({
			queryKey: ['list_phone_no'],
			queryFn: async () => {
				const phone_nos = await client.conversationalAi.phoneNumbers.list()
				if (filter) {
					return phone_nos.filter(
						phone =>
							phone.assignedAgent &&
							filter.includes(phone.assignedAgent.agentId),
					)
				}
				return phone_nos
			},
		}),
	list_knoledge_base: (
		client: ElevenLabsClient,
		{ filter }: { filter?: string[] },
	) =>
		queryOptions({
			queryKey: ['list_knoledge_base'],
			queryFn: async () => {
				const docs = await client.conversationalAi.knowledgeBase.list()
				const filteredDocs = filter
					? docs.documents.filter(doc =>
							doc.dependentAgents.some((agent: any) =>
								filter.includes(agent.id),
							),
						)
					: docs.documents
				return { ...docs, documents: filteredDocs }
			},
		}),
	list_voices: (client: ElevenLabsClient) =>
		queryOptions({
			queryKey: ['list_voices'],
			queryFn: async () => {
				return await client.voices.getAll()
			},
		}),
	get_phone_no: (client: ElevenLabsClient, id: string) =>
		queryOptions({
			queryKey: ['get_phone_no'],
			queryFn: async () => await client.conversationalAi.phoneNumbers.get(id),
		}),
}
