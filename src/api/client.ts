import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import { useAuth } from '@/context/auth-context'
export function useElevenLabsClient() {
	const auth = useAuth()
	return new ElevenLabsClient({ apiKey: auth?.api_key })
}
