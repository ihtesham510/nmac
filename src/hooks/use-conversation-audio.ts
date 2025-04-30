import { useElevenLabsClient } from '@/api/client'
import { useQuery } from '@tanstack/react-query'

export function usePlayAudio(conversationId: string) {
	const client = useElevenLabsClient()
	const { isLoading, refetch } = useQuery({
		queryKey: ['audio', conversationId],
		queryFn: async () =>
			await client.conversationalAi.getConversationAudio(conversationId),
		enabled: false,
	})

	const playAudio = async () => {
		const { data } = await refetch()
		if (data) {
			const audio = new Audio(data)
			audio.play()
		}
	}

	return { playAudio, isLoading }
}
