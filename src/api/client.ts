import { ElevenLabsClient } from 'elevenlabs'

const apiKey = import.meta.env.VITE_ELEVEN_LABS_API_KEY

export const client = new ElevenLabsClient({ apiKey: apiKey })
