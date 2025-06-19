import { useElevenLabsClient } from '@/api/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UnprocessableEntityError } from '@elevenlabs/elevenlabs-js/api'

export function useAddPhoneNo() {
	const client = useElevenLabsClient()
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['add_phone_no'],
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['list_phone_no'] })
			toast.success('Phone No Added Successfully')
		},
		onError: error => {
			if (error instanceof UnprocessableEntityError) {
				if (error.statusCode === 422) {
					toast.error('Please Enter a Valid Twilio Phone Number.')
				}
			}
			toast.error('Error while adding Phone No.')
		},
		mutationFn: async ({
			phone_number,
			label,
			sid,
			token,
			agentId,
		}: {
			phone_number: string
			label: string
			sid: string
			token: string
			agentId?: string
		}) => {
			const res = await client.conversationalAi.phoneNumbers.create({
				phoneNumber: phone_number,
				label,
				sid,
				token,
				provider: 'twilio',
			})
			if (agentId) {
				await client.conversationalAi.phoneNumbers.update(res.phoneNumberId, {
					agentId,
				})
			} else {
				return res
			}
		},
	})
}
