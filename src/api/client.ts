import { useAuth } from '@/context/auth-context'
import { ElevenLabsClient } from 'elevenlabs'
export function useElevenLabsClient() {
	const auth = useAuth()
	return new ElevenLabsClient({ apiKey: auth!.api_key })
}
