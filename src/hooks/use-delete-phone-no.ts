import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useElevenLabsClient } from '@/api/client'

export function useDeletePhoneNo() {
	const client = useElevenLabsClient()
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete_phone_no'],
		mutationFn: async (id: string) =>
			await client.conversationalAi.phoneNumbers.delete(id),
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ['list_phone_no'],
			})
		},
	})
}
